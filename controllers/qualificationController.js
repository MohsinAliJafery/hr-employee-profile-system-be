const Qualification = require('../models/Qualification');

// Get all qualifications
const getQualifications = async (req, res) => {
  try {
    const qualifications = await Qualification.find().sort({ order: 1, createdAt: -1 });
    res.json(qualifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch qualifications' });
  }
};

// Create new qualification
const createQualification = async (req, res) => {
  try {
    const { name, status = 1, isDefault = false, order = 0 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Qualification name is required' });
    }

    // Check for duplicate qualification
    const existingQualification = await Qualification.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingQualification) {
      return res.status(400).json({ error: 'Qualification already exists' });
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Qualification.updateMany({}, { isDefault: false });
    }

    const newQualification = new Qualification({
      name: name.trim(),
      status,
      isDefault,
      order: parseInt(order) || 0,
      holders: []
    });

    const savedQualification = await newQualification.save();
    res.status(201).json(savedQualification);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Qualification already exists' });
    }
    res.status(500).json({ error: 'Failed to create qualification' });
  }
};

// Update qualification
const updateQualification = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, isDefault, order } = req.body;

    const qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    // Check for duplicate (excluding current one)
    if (name && name.trim() !== qualification.name) {
      const existingQualification = await Qualification.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });

      if (existingQualification) {
        return res.status(400).json({ error: 'Qualification already exists' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Qualification.updateMany(
        { _id: { $ne: id } },
        { isDefault: false }
      );
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (status !== undefined) updateData.status = status;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (order !== undefined) updateData.order = parseInt(order) || 0;

    const updatedQualification = await Qualification.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedQualification);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Qualification already exists' });
    }
    res.status(500).json({ error: 'Failed to update qualification' });
  }
};

// Delete qualification
const deleteQualification = async (req, res) => {
  try {
    const { id } = req.params;

    const qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    // Check if qualification has holders
    if (qualification.holders.length > 0) {
      return res.status(400).json({ error: 'Cannot delete qualification with assigned holders' });
    }

    await Qualification.findByIdAndDelete(id);
    res.json({ message: 'Qualification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete qualification' });
  }
};

// Toggle qualification status
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    // Toggle status (1 to 0, 0 to 1)
    const newStatus = qualification.status === 1 ? 0 : 1;
    
    const updatedQualification = await Qualification.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    res.json(updatedQualification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle qualification status' });
  }
};

// Add holder to qualification
const addHolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { holderName } = req.body;

    if (!holderName || !holderName.trim()) {
      return res.status(400).json({ error: 'Holder name is required' });
    }

    const qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    // Check if holder already exists in this qualification
    if (qualification.holders.includes(holderName.trim())) {
      return res.status(400).json({ error: 'Holder already exists in this qualification' });
    }

    qualification.holders.push(holderName.trim());
    const updatedQualification = await qualification.save();

    res.json(updatedQualification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add holder to qualification' });
  }
};

// Remove holder from qualification
const removeHolder = async (req, res) => {
  try {
    const { id, holderName } = req.params;

    const qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    qualification.holders = qualification.holders.filter(
      holder => holder !== holderName
    );

    const updatedQualification = await qualification.save();
    res.json(updatedQualification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove holder from qualification' });
  }
};

module.exports = {
  getQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
  toggleStatus,
  addHolder,
  removeHolder
};