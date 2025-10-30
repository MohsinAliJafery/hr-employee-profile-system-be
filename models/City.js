const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
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

// Compound index to ensure unique city name per country
citySchema.index({ name: 1, countryId: 1 }, { unique: true });

const City = mongoose.model('City', citySchema);

module.exports = City;