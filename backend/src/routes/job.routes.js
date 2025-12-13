const express = require('express');
const router = express.Router();

const Job = require('../models/Job');
const { verifyToken, requirePlan, requireVerifiedEmail } = require('../middleware/auth');

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
