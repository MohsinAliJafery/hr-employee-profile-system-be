const express = require('express');
const {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  toggleStatus,
  addEmployee,
  removeEmployee,
  getDesignationsByDepartment
} = require('../controllers/designationController');

const router = express.Router();

// Designation routes
router.get('/', getDesignations);
router.post('/', createDesignation);
router.put('/:id', updateDesignation);
router.delete('/:id', deleteDesignation);
router.patch('/:id/toggle-status', toggleStatus);

// Employee management routes
router.post('/:id/employees', addEmployee);
router.delete('/:id/employees/:employeeName', removeEmployee);

// Department specific routes
router.get('/department/:department', getDesignationsByDepartment);

module.exports = router;