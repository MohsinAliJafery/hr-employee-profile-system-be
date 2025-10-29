const express = require('express');
const {
  getCities,
  getCountries,
  createCity,
  updateCity,
  deleteCity,
  toggleStatus,
  addEmployee,
  removeEmployee
} = require('../controllers/cityController');

const router = express.Router();

router.get('/', getCities);
router.get('/countries', getCountries);
router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);
router.patch('/:id/toggle-status', toggleStatus);
router.post('/:id/employees', addEmployee);
router.delete('/:id/employees/:employeeName', removeEmployee);

module.exports = router;