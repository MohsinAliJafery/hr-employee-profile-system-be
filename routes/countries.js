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

router.get('/', getCountries);
router.post('/', createCountry);
router.put('/:id', updateCountry);
router.delete('/:id', deleteCountry);
router.patch('/:id/toggle-status', toggleStatus);
router.post('/:id/employees', addEmployee);
router.delete('/:id/employees/:employeeName', removeEmployee);

module.exports = router;