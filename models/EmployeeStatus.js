//imran file

const mongoose = require('mongoose');

const employeeStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    totalEmployees: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmployeeStatus', employeeStatusSchema);