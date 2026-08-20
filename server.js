require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./src/config/db');
const { initJsonStorage } = require('./src/storage/jsonStorage');
const dataManager = require('./src/storage/dataManager');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: dataManager.getStorageMode(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start server
async function startServer() {
  // Try connecting to MongoDB or initialize JSON storage
  const isMongo = await connectDB();
  if (isMongo) {
    await dataManager.seedMongoIfNeeded();
  } else {
    initJsonStorage();
  }

  // Only start listening if run directly in standalone mode (not serverless wrapper)
  if (process.env.NODE_ENV !== 'test' && (!process.env.VERCEL || require.main === module)) {
    app.listen(PORT, () => {
      console.log(`
===========================================================
🚀 Bereket Woldemariyam - Dynamic Portfolio Server
📡 URL: http://localhost:${PORT}
💾 Storage Engine: ${dataManager.getStorageMode()}
🌐 GitHub API Target: https://api.github.com/users/${process.env.GITHUB_USERNAME || 'bereket2114'}/repos
===========================================================
      `);
    });
  }
}

startServer();

module.exports = app;
