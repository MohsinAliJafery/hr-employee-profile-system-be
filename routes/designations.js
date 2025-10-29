const express = require('express');
const {
  getDesignations,
  getDepartments,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  toggleStatus
} = require('../controllers/designationController');

const router = express.Router();

router.get('/', getDesignations);
router.get('/departments', getDepartments);
router.post('/', createDesignation);
router.put('/:id', updateDesignation);
router.delete('/:id', deleteDesignation);
router.patch('/:id/toggle-status', toggleStatus);

module.exports = router;