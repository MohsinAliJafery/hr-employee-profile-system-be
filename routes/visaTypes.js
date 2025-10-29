const express = require('express');
const {
  getVisaTypes,
  createVisaType,
  updateVisaType,
  deleteVisaType
} = require('../controllers/visaTypesController');

const router = express.Router();

router.get('/', getVisaTypes);
router.post('/', createVisaType);
router.put('/:id', updateVisaType);
router.delete('/:id', deleteVisaType);

module.exports = router;