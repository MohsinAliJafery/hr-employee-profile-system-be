const express = require('express');
const {
  getCities,
  getCountries,
  createCity,
  updateCity,
  deleteCity,
  toggleStatus,
  addEmployee,
  removeEmployee,
  getCitiesByCountry
} = require('../controllers/cityController');

const router = express.Router();

// City routes
router.get('/', getCities);
router.get('/countries', getCountries);
router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);
router.patch('/:id/toggle-status', toggleStatus);

// Employee management routes
router.post('/:id/employees', addEmployee);
router.delete('/:id/employees/:employeeName', removeEmployee);

// Country specific routes
router.get('/country/:countryId', getCitiesByCountry);

module.exports = router;