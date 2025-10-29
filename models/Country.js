const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  employees: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Country', countrySchema);