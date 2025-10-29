const express = require('express');
const {
  getTitles,
  createTitle,
  updateTitle,
  deleteTitle,
  toggleStatus
} = require('../controllers/titleController');

const router = express.Router();

router.get('/', getTitles);
router.post('/', createTitle);
router.put('/:id', updateTitle);
router.delete('/:id', deleteTitle);
router.patch('/:id/toggle-status', toggleStatus);

module.exports = router;