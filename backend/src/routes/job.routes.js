const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

const Job = require('../models/Job');
const User = require('../models/User');
const { verifyToken, requirePlan, requireVerifiedEmail } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const MAX_ROWS_PER_FILE = 10000;

const isEmailLike = (value) => {
  if (!value || typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const extractEmailsFromCsv = (buffer) => {
  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);
  const emails = [];
  for (const line of lines) {
    if (!line) continue;
    const cells = line.split(',');
    for (const cell of cells) {
      const candidate = (cell || '').trim().replace(/^"|"$/g, '');
      if (isEmailLike(candidate)) {
        emails.push(candidate.toLowerCase());
        break;
      }
    }
  }
  return emails;
};

const extractEmailsFromExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames?.[0];
  if (!sheetName) return [];

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: false });
  const emails = [];

  for (const row of rows) {
    if (!Array.isArray(row)) continue;
    for (const cell of row) {
      const candidate = typeof cell === 'string' ? cell.trim() : String(cell ?? '').trim();
      if (isEmailLike(candidate)) {
        emails.push(candidate.toLowerCase());
        break;
      }
    }
  }

  return emails;
};

// All routes require authentication
router.use(verifyToken);
router.use(requireVerifiedEmail);

/**
 * GET /jobs
 * List user's jobs
 */
router.get('/', async (req, res, next) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    const query = { userId: req.userId };
    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /jobs/upload
 * Upload and create a bulk validation job
 * Supports .csv, .xls, .xlsx up to 10,000 rows
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File is required', message: 'Please upload a .csv, .xls, or .xlsx file' });
    }

    const originalName = (file.originalname || '').toLowerCase();
    const isCsv = originalName.endsWith('.csv');
    const isXlsx = originalName.endsWith('.xlsx');
    const isXls = originalName.endsWith('.xls');

    if (!isCsv && !isXlsx && !isXls) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Supported file types: .csv, .xls, .xlsx',
      });
    }

    // Parse emails
    let emails = [];
    if (isCsv) {
      emails = extractEmailsFromCsv(file.buffer);
    } else {
      emails = extractEmailsFromExcel(file.buffer);
    }

    // De-dupe
    const uniqueEmails = Array.from(new Set(emails));
    const emailCount = uniqueEmails.length;

    if (emailCount <= 0) {
      return res.status(400).json({ error: 'No emails found', message: 'No valid email addresses found in the uploaded file' });
    }

    if (emailCount > MAX_ROWS_PER_FILE) {
      return res.status(400).json({
        error: 'Max rows exceeded',
        message: `Maximum ${MAX_ROWS_PER_FILE.toLocaleString()} rows per file`,
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Credits enforcement (free plan)
    if (user.plan === 'free') {
      if (user.credits <= 0) {
        return res.status(403).json({
          error: 'No credits remaining',
          message: 'No credits remaining',
          creditsRemaining: 0,
        });
      }

      if (emailCount > user.credits) {
        return res.status(403).json({
          error: 'Not enough credits',
          message: `Not enough credits to validate ${emailCount} emails. You have ${user.credits} credits remaining.`,
          creditsRemaining: user.credits,
          requiredCredits: emailCount,
        });
      }
    }

    const jobId = new Job({
      userId: user._id,
      filename: `${uuidv4()}`,
      originalFilename: file.originalname,
      status: 'pending',
      totalEmails: emailCount,
      processedEmails: 0,
      validCount: 0,
      invalidCount: 0,
      catchAllCount: 0,
    });

    await jobId.save();

    res.status(201).json({
      jobId: jobId._id,
      emailCount,
      message: 'Upload successful. Job created.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /jobs/:jobId/download
 * Download job results (not available until processing completes)
 */
router.get('/:jobId/download', async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, userId: req.userId });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'completed' || !job.resultFileUrl) {
      return res.status(404).json({
        error: 'Results not available',
        message: 'Results are not available yet for this job',
      });
    }

    return res.status(501).json({
      error: 'Not implemented',
      message: 'Download is not implemented yet in this backend deployment',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /jobs/:jobId
 * Get job details and progress
 */
router.get('/:jobId', async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      userId: req.userId
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      id: job._id,
      filename: job.originalFilename,
      status: job.status,
      progress: job.progress,
      totalEmails: job.totalEmails,
      processedEmails: job.processedEmails,
      validCount: job.validCount,
      invalidCount: job.invalidCount,
      catchAllCount: job.catchAllCount,
      resultFileUrl: job.status === 'completed' ? job.resultFileUrl : null,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      completedAt: job.completedAt
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /jobs/:jobId
 * Delete a job
 */
router.delete('/:jobId', async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      userId: req.userId
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Only allow deletion of completed or failed jobs
    if (!['completed', 'failed'].includes(job.status)) {
      return res.status(400).json({ 
        error: 'Cannot delete job in progress' 
      });
    }

    await job.deleteOne();

    res.json({ message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
