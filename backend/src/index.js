require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const billingRoutes = require('./routes/billingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const validationRoutes = require('./routes/validationRoutes');
const legacyValidationRoutes = require('./routes/legacyValidationRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'https://www.mailvet.app',
  'https://mailvet.app',
  'https://dashboard.mailvet.app',
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
  // Development
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
].filter(Boolean);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser()); // Parse cookies for refresh token
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString('utf8');
      }
    },
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (v1)
app.use('/v1/auth', authRoutes);
app.use('/v1/account', accountRoutes);
app.use('/v1/billing', billingRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/validation', validationRoutes);
app.use('/v1', legacyValidationRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001;

const mongoDbName = process.env.MONGODB_DBNAME || 'mailvet';

mongoose.connect(process.env.MONGODB_URI, { dbName: mongoDbName })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log(`MongoDB database: ${mongoose.connection?.name || '(unknown)'}`);
    app.listen(PORT, () => {
      console.log(`MailVet API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
