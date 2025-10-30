const mongoose = require('mongoose');

const visaTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Number,
    default: 1
  },
  isDefault: {
    type: Number,
    default: 0
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

const VisaType = mongoose.model('VisaType', visaTypeSchema);

module.exports = VisaType;