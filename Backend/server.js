/**
 * GYANVIX EMPLOYEE MANAGEMENT SYSTEM
 * Main Server File - Entry Point
 */

// ============================================
// LOAD ENVIRONMENT VARIABLES
// ============================================
require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');

// Initialize Express app
const app = express();

// ============================================
// CONNECT DATABASE
// ============================================
connectDB();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow PUT & DELETE from forms
app.use(methodOverride('_method'));

// Serve static files from FRONTEND/public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Set EJS view engine
app.set('view engine', 'ejs');

// Set views folder from FRONTEND/views
app.set('views', path.join(__dirname, '../frontend/views'));

// ============================================
// ROUTES
// ============================================

// Employee routes
app.use('/', employeeRoutes);

// ============================================
// 404 ERROR HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page Not Found',
    error: `The page ${req.url} does not exist`,
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal Server Error',
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   GYANVIX EMPLOYEE MANAGEMENT SYSTEM           ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('═══════════════════════════════════════════════════');
});

// ============================================
// HANDLE UNHANDLED PROMISE REJECTIONS
// ============================================
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
