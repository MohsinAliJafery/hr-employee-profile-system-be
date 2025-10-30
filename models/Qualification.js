const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
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
  holders: [{
    type: String
  }]
}, {
  timestamps: true
});

const Qualification = mongoose.model('Qualification', qualificationSchema);

module.exports = Qualification;