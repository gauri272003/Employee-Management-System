/**
 * Employee Controller
 * Contains all business logic for employee operations
 */

const Employee = require('../models/Employee');

/**
 * @desc    Render Dashboard with statistics
 * @route   GET /
 */
exports.renderDashboard = async (req, res) => {
  try {
    // Get all active employees
    const employees = await Employee.findActive().sort({ createdAt: -1 });

    // Calculate statistics
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp) => emp.status === 'Active').length;
    const inactiveEmployees = employees.filter((emp) => emp.status === 'Inactive').length;

    // Get unique departments
    const departments = [...new Set(employees.map((emp) => emp.department))];
    const totalDepartments = departments.length;

    // Department-wise count
    const departmentStats = departments.map((dept) => ({
      name: dept,
      count: employees.filter((emp) => emp.department === dept).length,
    }));

    // Recent employees (last 5)
    const recentEmployees = employees.slice(0, 5);

    res.render('index', {
      title: 'Dashboard',
      stats: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
        departments: totalDepartments,
      },
      departmentStats,
      recentEmployees,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).render('error', {
      message: 'Error loading dashboard',
      error: error.message,
    });
  }
};

/**
 * @desc    Render Add Employee Form
 * @route   GET /employees/add
 */
exports.renderAddForm = (req, res) => {
  res.render('add-employee', {
    title: 'Add Employee',
  });
};

/**
 * @desc    Add new employee
 * @route   POST /employees
 */
exports.addEmployee = async (req, res) => {
  try {
    const {
      name,
      employeeId,
      email,
      phone,
      department,
      designation,
      joiningDate,
      salary,
      status,
    } = req.body;

    // Create new employee
    const employee = await Employee.create({
      name,
      employeeId,
      email,
      phone,
      department,
      designation,
      joiningDate,
      salary,
      status: status || 'Active',
    });

    console.log('✅ Employee added successfully:', employee.employeeId);

    // Redirect to employee list with success message
    res.redirect('/employees?success=Employee added successfully');
  } catch (error) {
    console.error('Add Employee Error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).render('add-employee', {
        title: 'Add Employee',
        error: `${field === 'employeeId' ? 'Employee ID' : 'Email'} already exists`,
        formData: req.body,
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).render('add-employee', {
        title: 'Add Employee',
        error: messages.join(', '),
        formData: req.body,
      });
    }

    res.status(500).render('add-employee', {
      title: 'Add Employee',
      error: 'Error adding employee. Please try again.',
      formData: req.body,
    });
  }
};

/**
 * @desc    Get all employees (excluding soft deleted)
 * @route   GET /employees
 */
exports.getAllEmployees = async (req, res) => {
  try {
    const { search, department, status } = req.query;

    // Build query filter
    let filter = { isDeleted: false };

    // Search by name, employee ID, or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by department
    if (department) {
      filter.department = department;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Get employees with filters
    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.render('employee-list', {
      title: 'Employee List',
      employees,
      filters: { search, department, status },
      success: req.query.success,
    });
  } catch (error) {
    console.error('Get Employees Error:', error);
    res.status(500).render('error', {
      message: 'Error loading employees',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single employee profile
 * @route   GET /employees/:id
 */
exports.getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).render('error', {
        message: 'Employee not found',
        error: 'The requested employee does not exist or has been deleted',
      });
    }

    res.render('employee-profile', {
      title: `${employee.name} - Profile`,
      employee,
    });
  } catch (error) {
    console.error('Get Employee Profile Error:', error);
    res.status(500).render('error', {
      message: 'Error loading employee profile',
      error: error.message,
    });
  }
};

/**
 * @desc    Render Edit Employee Form
 * @route   GET /employees/:id/edit
 */
exports.renderEditForm = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).render('error', {
        message: 'Employee not found',
        error: 'The requested employee does not exist or has been deleted',
      });
    }

    // Format date for input field (YYYY-MM-DD)
    const formattedDate = employee.joiningDate.toISOString().split('T')[0];

    res.render('edit-employee', {
      title: `Edit ${employee.name}`,
      employee: {
        ...employee.toObject(),
        joiningDate: formattedDate,
      },
    });
  } catch (error) {
    console.error('Render Edit Form Error:', error);
    res.status(500).render('error', {
      message: 'Error loading edit form',
      error: error.message,
    });
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /employees/:id
 */
exports.updateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      designation,
      joiningDate,
      salary,
      status,
    } = req.body;

    // Find employee
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).render('error', {
        message: 'Employee not found',
        error: 'The requested employee does not exist or has been deleted',
      });
    }

    // Update fields
    employee.name = name;
    employee.email = email;
    employee.phone = phone;
    employee.department = department;
    employee.designation = designation;
    employee.joiningDate = joiningDate;
    employee.salary = salary;
    employee.status = status;

    // Save updated employee
    await employee.save();

    console.log('✅ Employee updated successfully:', employee.employeeId);

    // Redirect to profile with success message
    res.redirect(`/employees/${employee._id}?success=Employee updated successfully`);
  } catch (error) {
    console.error('Update Employee Error:', error);

    // Handle duplicate email error
    if (error.code === 11000) {
      const employee = await Employee.findById(req.params.id);
      return res.status(400).render('edit-employee', {
        title: `Edit ${employee.name}`,
        employee: req.body,
        error: 'Email already exists',
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const employee = await Employee.findById(req.params.id);
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).render('edit-employee', {
        title: `Edit ${employee.name}`,
        employee: req.body,
        error: messages.join(', '),
      });
    }

    res.status(500).render('error', {
      message: 'Error updating employee',
      error: error.message,
    });
  }
};

/**
 * @desc    Soft delete employee
 * @route   DELETE /employees/:id
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Perform soft delete
    await employee.softDelete();

    console.log('✅ Employee soft deleted:', employee.employeeId);

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Delete Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message,
    });
  }
};

/**
 * @desc    Get employee statistics (API endpoint)
 * @route   GET /api/employees/stats
 */
exports.getEmployeeStats = async (req, res) => {
  try {
    const employees = await Employee.findActive();

    const stats = {
      total: employees.length,
      active: employees.filter((emp) => emp.status === 'Active').length,
      inactive: employees.filter((emp) => emp.status === 'Inactive').length,
      byDepartment: {},
    };

    // Group by department
    employees.forEach((emp) => {
      if (!stats.byDepartment[emp.department]) {
        stats.byDepartment[emp.department] = 0;
      }
      stats.byDepartment[emp.department]++;
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
