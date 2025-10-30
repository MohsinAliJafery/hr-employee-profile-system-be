const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 1 // 1 = Active, 0 = Inactive
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  employees: [{
    type: String
  }]
}, {
  timestamps: true
});

// Compound index to ensure unique designation per department
designationSchema.index({ title: 1, department: 1 }, { unique: true });

const Designation = mongoose.model('Designation', designationSchema);

module.exports = Designation;