const express = require('express');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleStatus,
  addEmployee,
  removeEmployee
} = require('../controllers/departmentController');

const router = express.Router();

// Department routes
router.get('/', getDepartments);
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);
router.patch('/:id/toggle-status', toggleStatus);

// Employee management routes
router.post('/:id/employees', addEmployee);
router.delete('/:id/employees/:employeeName', removeEmployee);

module.exports = router;