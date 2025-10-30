const express = require('express');
const router = express.Router();
const {
  getQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
  toggleStatus,
  addHolder,
  removeHolder
} = require('../controllers/qualificationController');

router.get('/', getQualifications);
router.post('/', createQualification);
router.put('/:id', updateQualification);
router.delete('/:id', deleteQualification);
router.patch('/:id/toggle-status', toggleStatus);
router.post('/:id/holders', addHolder);
router.delete('/:id/holders/:holderName', removeHolder);

module.exports = router;