const mongoose = require('mongoose');

const nationalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
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
  citizens: [{
    type: String
  }]
}, {
  timestamps: true
});

const Nationality = mongoose.model('Nationality', nationalitySchema);

module.exports = Nationality;