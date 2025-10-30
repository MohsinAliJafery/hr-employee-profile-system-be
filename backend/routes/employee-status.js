//imran
const EmployeeStatus = require('../models/EmployeeStatus');

const express = require('express');

const router = express.Router();

// Create new status
router.post('/', async (req, res) => {
  try {
    // If the new record is marked as default, unset all others
    if (req.body.isDefault) {
      await EmployeeStatus.updateMany({}, { isDefault: false });
    }

    const newStatus = new EmployeeStatus(req.body);
    const saved = await newStatus.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all statuses (with search + pagination)
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const query = search ? { status: { $regex: search, $options: 'i' } } : {};

    const total = await EmployeeStatus.countDocuments(query);
    const statuses = await EmployeeStatus.find(query)
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, statuses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status
router.put('/:id', async (req, res) => {
  try {
    // If this record is being set as default, first unset all others
    if (req.body.isDefault === true) {
      await EmployeeStatus.updateMany(
        { _id: { $ne: req.params.id } },
        { $set: { isDefault: false } }
      );
    }

    // Then update the target record
    const updated = await EmployeeStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(201).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete status
router.delete('/:id', async (req, res) => {
  try {
    await EmployeeStatus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Status deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
