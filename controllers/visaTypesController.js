const VisaType = require('../models/VisaType');

// Get all visa types
exports.getVisaTypes = async (req, res) => {
  try {
    const visaTypes = await VisaType.find();
    res.json(visaTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visa types' });
  }
};

// Create new visa type
exports.createVisaType = async (req, res) => {
  try {
    const { type, active = 1, isDefault = 0 } = req.body;

    if (!type || !type.trim()) {
      return res.status(400).json({ error: 'Visa type name is required' });
    }

    // Check for duplicate
    const existingType = await VisaType.findOne({ 
      type: { $regex: new RegExp(`^${type.trim()}$`, 'i') } 
    });

    if (existingType) {
      return res.status(400).json({ error: 'Visa type already exists' });
    }

    // If setting as default, remove default from others
    if (isDefault === 1) {
      await VisaType.updateMany({}, { isDefault: 0 });
    }

    const newVisaType = new VisaType({
      type: type.trim(),
      active,
      isDefault,
      employees: []
    });

    const savedVisaType = await newVisaType.save();
    res.status(201).json(savedVisaType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create visa type' });
  }
};

// Update visa type
exports.updateVisaType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, active, isDefault } = req.body;

    const visaType = await VisaType.findById(id);
    if (!visaType) {
      return res.status(404).json({ error: 'Visa type not found' });
    }

    // Check for duplicate (excluding current one)
    if (type && type.trim() !== visaType.type) {
      const existingType = await VisaType.findOne({
        _id: { $ne: id },
        type: { $regex: new RegExp(`^${type.trim()}$`, 'i') }
      });

      if (existingType) {
        return res.status(400).json({ error: 'Visa type already exists' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault === 1) {
      await VisaType.updateMany({ _id: { $ne: id } }, { isDefault: 0 });
    }

    // Update fields
    const updateData = {};
    if (type !== undefined) updateData.type = type.trim();
    if (active !== undefined) updateData.active = active;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedVisaType = await VisaType.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedVisaType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update visa type' });
  }
};

// Delete visa type
exports.deleteVisaType = async (req, res) => {
  try {
    const { id } = req.params;

    const visaType = await VisaType.findById(id);
    if (!visaType) {
      return res.status(404).json({ error: 'Visa type not found' });
    }

    // Check if visa type has employees
    if (visaType.employees.length > 0) {
      return res.status(400).json({ error: 'Cannot delete visa type with assigned employees' });
    }

    // Check if it's default visa type
    if (visaType.isDefault === 1) {
      return res.status(400).json({ error: 'Cannot delete default visa type' });
    }

    await VisaType.findByIdAndDelete(id);
    res.json({ message: 'Visa type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete visa type' });
  }
};