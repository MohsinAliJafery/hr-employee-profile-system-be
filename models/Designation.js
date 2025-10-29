const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  employees: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure unique designation titles per department
designationSchema.index({ department: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Designation', designationSchema);