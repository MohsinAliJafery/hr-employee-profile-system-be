const Department = require('../models/Department');

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Create new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, isDefault = false } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    // Check for duplicate
    const existingDept = await Department.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (existingDept) {
      return res.status(400).json({ error: 'Department already exists' });
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Department.updateMany({}, { isDefault: false });
    }

    const newDepartment = new Department({
      name: name.trim(),
      employees: [],
      status: 1,
      isDefault
    });

    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, isDefault } = req.body;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Check for duplicate (excluding current one)
    if (name && name.trim() !== department.name) {
      const existingDept = await Department.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });

      if (existingDept) {
        return res.status(400).json({ error: 'Department already exists' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Department.updateMany({ _id: { $ne: id } }, { isDefault: false });
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (status !== undefined) updateData.status = status;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Check if department has employees
    if (department.employees.length > 0) {
      return res.status(400).json({ error: 'Cannot delete department with assigned employees' });
    }

    // Check if it's default department
    if (department.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default department' });
    }

    await Department.findByIdAndDelete(id);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

// Toggle department status
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    department.status = department.status === 1 ? 0 : 1;
    const updatedDepartment = await department.save();

    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle department status' });
  }
};