require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');
const validationRoutes = require('./routes/validation.routes');
const jobRoutes = require('./routes/job.routes');
const billingRoutes = require('./routes/billing.routes');
const planRoutes = require('./routes/plan.routes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (v1)
app.use('/v1/auth', authRoutes);
app.use('/v1/account', accountRoutes);
app.use('/v1', validationRoutes);
app.use('/v1/jobs', jobRoutes);
app.use('/v1/billing', billingRoutes);
app.use('/v1/plans', planRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`MailVet API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
