/**
 * Employee Mongoose Model
 * Defines schema and validation rules for Employee documents
 */

const mongoose = require('mongoose');

// Employee Schema Definition
const employeeSchema = new mongoose.Schema(
  {
    // Full name of employee
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Unique employee ID
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]+$/, 'Employee ID must contain only letters and numbers'],
    },

    // Email address
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    // Phone number
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },

    // Department
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'],
        message: '{VALUE} is not a valid department',
      },
    },

    // Designation/Job Title
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      minlength: [2, 'Designation must be at least 2 characters long'],
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },

    // Date of joining
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
      validate: {
        validator: function (value) {
          // Joining date cannot be in the future
          return value <= new Date();
        },
        message: 'Joining date cannot be in the future',
      },
    },

    // Salary
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
      max: [100000000, 'Salary seems too high'],
    },

    // Employment status
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },

    // Soft delete flag - DO NOT permanently delete records
    isDeleted: {
      type: Boolean,
      default: false,
      select: true, // Always include in queries
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Index for faster queries
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ isDeleted: 1 });

// Virtual field to format salary
employeeSchema.virtual('formattedSalary').get(function () {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(this.salary);
});

// Virtual field to calculate tenure
employeeSchema.virtual('tenure').get(function () {
  const years = Math.floor(
    (new Date() - this.joiningDate) / (365.25 * 24 * 60 * 60 * 1000)
  );
  const months = Math.floor(
    ((new Date() - this.joiningDate) % (365.25 * 24 * 60 * 60 * 1000)) /
      (30.44 * 24 * 60 * 60 * 1000)
  );
  return `${years} years, ${months} months`;
});

// Pre-save middleware to uppercase employeeId
employeeSchema.pre('save', function (next) {
  if (this.employeeId) {
    this.employeeId = this.employeeId.toUpperCase();
  }
  next();
});

// Instance method to soft delete employee
employeeSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.status = 'Inactive';
  return this.save();
};

// Instance method to restore soft deleted employee
employeeSchema.methods.restore = function () {
  this.isDeleted = false;
  return this.save();
};

// Static method to find active employees only
employeeSchema.statics.findActive = function () {
  return this.find({ isDeleted: false });
};

// Static method to find by employee ID
employeeSchema.statics.findByEmployeeId = function (empId) {
  return this.findOne({ employeeId: empId.toUpperCase(), isDeleted: false });
};

// Export Employee model
module.exports = mongoose.model('Employee', employeeSchema);
