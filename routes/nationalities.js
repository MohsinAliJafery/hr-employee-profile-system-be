const express = require('express');
const router = express.Router();
const {
  getNationalities,
  createNationality,
  updateNationality,
  deleteNationality,
  toggleStatus,
  addCitizen,
  removeCitizen
} = require('../controllers/nationalityController');

router.get('/', getNationalities);
router.post('/', createNationality);
router.put('/:id', updateNationality);
router.delete('/:id', deleteNationality);
router.patch('/:id/toggle-status', toggleStatus);
router.post('/:id/citizens', addCitizen);
router.delete('/:id/citizens/:citizenName', removeCitizen);

module.exports = router;