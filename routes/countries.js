const express = require('express');
const {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  toggleStatus,
  addEmployee,
  removeEmployee
} = require('../controllers/countryController');

const router = express.Router();

// Country routes
router.get('/', getCountries);
router.post('/', createCountry);
router.put('/:id', updateCountry);
router.delete('/:id', deleteCountry);
router.patch('/:id/toggle-status', toggleStatus);

// Employee management routes
router.post('/:id/employees', addEmployee);
router.delete('/:id/employees/:employeeName', removeEmployee);

module.exports = router;