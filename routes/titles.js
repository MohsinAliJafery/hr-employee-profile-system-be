const express = require('express');
const {
  getTitles,
  createTitle,
  updateTitle,
  deleteTitle,
  toggleStatus,
  addEmployee,
  removeEmployee
} = require('../controllers/titleController');

const router = express.Router();

// Title routes
router.get('/', getTitles);
router.post('/', createTitle);
router.put('/:id', updateTitle);
router.delete('/:id', deleteTitle);
router.patch('/:id/toggle-status', toggleStatus);

// Employee management routes
router.post('/:id/employees', addEmployee);
router.delete('/:id/employees/:employeeName', removeEmployee);

module.exports = router;