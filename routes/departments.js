const express = require('express');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleStatus
} = require('../controllers/departmentController');

const router = express.Router();

router.get('/', getDepartments);
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);
router.patch('/:id/toggle-status', toggleStatus);

module.exports = router;