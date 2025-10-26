const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institute: {
    type: String,
    required: true
  },
  passingYear: {
    type: String,
    required: true
  },
  documentPath: { 
    type: String,
    default: ''
  }
});

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'United Kingdom'
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  visaType: {
    type: String,
    required: [true, 'Visa type is required'],
    trim: true
  },
  visaExpiry: {
    type: Date,
    required: [true, 'Visa expiry date is required']
  },
  visaDocumentPath: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  educations: [educationSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for full name
employeeSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Employee', employeeSchema);