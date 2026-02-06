/**
 * Employee Routes
 * Defines all routes for employee operations
 */

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// ============================================
// VIEW ROUTES (Render EJS Templates)
// ============================================

/**
 * @route   GET /
 * @desc    Dashboard - Home page with statistics
 * @access  Public
 */
router.get('/', employeeController.renderDashboard);

/**
 * @route   GET /employees/add
 * @desc    Render add employee form
 * @access  Public
 */
router.get('/employees/add', employeeController.renderAddForm);

/**
 * @route   GET /employees
 * @desc    List all employees (with search and filters)
 * @access  Public
 */
router.get('/employees', employeeController.getAllEmployees);

/**
 * @route   GET /employees/:id
 * @desc    View single employee profile
 * @access  Public
 */
router.get('/employees/:id', employeeController.getEmployeeProfile);

/**
 * @route   GET /employees/:id/edit
 * @desc    Render edit employee form
 * @access  Public
 */
router.get('/employees/:id/edit', employeeController.renderEditForm);

// ============================================
// API ROUTES (CRUD Operations)
// ============================================

/**
 * @route   POST /employees
 * @desc    Create new employee
 * @access  Public
 */
router.post('/employees', employeeController.addEmployee);

/**
 * @route   PUT /employees/:id
 * @desc    Update employee details
 * @access  Public
 */
router.put('/employees/:id', employeeController.updateEmployee);

/**
 * @route   DELETE /employees/:id
 * @desc    Soft delete employee
 * @access  Public
 */
router.delete('/employees/:id', employeeController.deleteEmployee);

/**
 * @route   GET /api/employees/stats
 * @desc    Get employee statistics
 * @access  Public
 */
router.get('/api/employees/stats', employeeController.getEmployeeStats);

module.exports = router;
