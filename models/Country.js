const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
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

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;