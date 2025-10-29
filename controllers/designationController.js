const Designation = require('../models/Designation');

// Get all designations
exports.getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find().sort({ createdAt: -1 });
    res.json(designations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
};

// Get departments list
exports.getDepartments = async (req, res) => {
  try {
    // You can get this from your departments collection or hardcode
    const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Create new designation
exports.createDesignation = async (req, res) => {
  try {
    const { department, title, isActive = true, isDefault = false } = req.body;

    if (!department || !title) {
      return res.status(400).json({ error: 'Department and title are required' });
    }

    // Check for duplicate designation in the same department
    const existingDesignation = await Designation.findOne({
      department,
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
    });

    if (existingDesignation) {
      return res.status(400).json({ error: 'Designation already exists in this department' });
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Designation.updateMany({}, { isDefault: false });
    }

    const newDesignation = new Designation({
      department: department.trim(),
      title: title.trim(),
      employees: 0,
      isActive,
      isDefault
    });

    const savedDesignation = await newDesignation.save();
    res.status(201).json(savedDesignation);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Designation already exists in this department' });
    }
    res.status(500).json({ error: 'Failed to create designation' });
  }
};

// Update designation
exports.updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { department, title, isActive, isDefault } = req.body;

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    // Check for duplicate (excluding current one)
    if ((department && department !== designation.department) || 
        (title && title !== designation.title)) {
      const existingDesignation = await Designation.findOne({
        _id: { $ne: id },
        department: department || designation.department,
        title: { $regex: new RegExp(`^${(title || designation.title).trim()}$`, 'i') }
      });

      if (existingDesignation) {
        return res.status(400).json({ error: 'Designation already exists in this department' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Designation.updateMany({ _id: { $ne: id } }, { isDefault: false });
    }

    // Update fields
    const updateData = {};
    if (department !== undefined) updateData.department = department.trim();
    if (title !== undefined) updateData.title = title.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedDesignation = await Designation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedDesignation);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Designation already exists in this department' });
    }
    res.status(500).json({ error: 'Failed to update designation' });
  }
};

// Delete designation
exports.deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    // Check if designation has employees
    if (designation.employees > 0) {
      return res.status(400).json({ error: 'Cannot delete designation with assigned employees' });
    }

    // Check if it's default designation
    if (designation.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default designation' });
    }

    await Designation.findByIdAndDelete(id);
    res.json({ message: 'Designation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete designation' });
  }
};

// Toggle designation status
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    designation.isActive = !designation.isActive;
    const updatedDesignation = await designation.save();

    res.json(updatedDesignation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle designation status' });
  }
};