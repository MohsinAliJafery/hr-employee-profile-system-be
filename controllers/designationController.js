const Designation = require('../models/Designation');

// Get all designations
const getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find().sort({ order: 1, createdAt: -1 });
    res.json(designations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
};

// Create new designation
const createDesignation = async (req, res) => {
  try {
    const { title, department, status = 1, isDefault = false, order = 0 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Designation title is required' });
    }

    if (!department) {
      return res.status(400).json({ error: 'Department is required' });
    }

    // Check for duplicate designation in the same department
    const existingDesignation = await Designation.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },
      department: department
    });

    if (existingDesignation) {
      return res.status(400).json({ error: 'Designation already exists in this department' });
    }

    // If setting as default, remove default from others in the same department
    if (isDefault) {
      await Designation.updateMany(
        { department: department },
        { isDefault: false }
      );
    }

    const newDesignation = new Designation({
      title: title.trim(),
      department,
      status,
      isDefault,
      order: parseInt(order) || 0,
      employees: []
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
const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, status, isDefault, order } = req.body;

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    // Check for duplicate (excluding current one)
    if ((title && title.trim() !== designation.title) || department !== designation.department) {
      const existingDesignation = await Designation.findOne({
        _id: { $ne: id },
        title: { $regex: new RegExp(`^${title?.trim() || designation.title}$`, 'i') },
        department: department || designation.department
      });

      if (existingDesignation) {
        return res.status(400).json({ error: 'Designation already exists in this department' });
      }
    }

    // If setting as default, remove default from others in the same department
    if (isDefault) {
      await Designation.updateMany(
        { 
          department: department || designation.department,
          _id: { $ne: id }
        },
        { isDefault: false }
      );
    }

    // Update fields
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (department !== undefined) updateData.department = department;
    if (status !== undefined) updateData.status = status;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (order !== undefined) updateData.order = parseInt(order) || 0;

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
const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    // Check if designation has employees
    if (designation.employees.length > 0) {
      return res.status(400).json({ error: 'Cannot delete designation with assigned employees' });
    }

    await Designation.findByIdAndDelete(id);
    res.json({ message: 'Designation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete designation' });
  }
};

// Toggle designation status
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    // Toggle status (1 to 0, 0 to 1)
    const newStatus = designation.status === 1 ? 0 : 1;
    
    const updatedDesignation = await Designation.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    res.json(updatedDesignation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle designation status' });
  }
};

// Add employee to designation
const addEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName } = req.body;

    if (!employeeName || !employeeName.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    // Check if employee already exists in this designation
    if (designation.employees.includes(employeeName.trim())) {
      return res.status(400).json({ error: 'Employee already exists in this designation' });
    }

    designation.employees.push(employeeName.trim());
    const updatedDesignation = await designation.save();

    res.json(updatedDesignation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee to designation' });
  }
};

// Remove employee from designation
const removeEmployee = async (req, res) => {
  try {
    const { id, employeeName } = req.params;

    const designation = await Designation.findById(id);
    if (!designation) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    designation.employees = designation.employees.filter(
      emp => emp !== employeeName
    );

    const updatedDesignation = await designation.save();
    res.json(updatedDesignation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove employee from designation' });
  }
};

// Get designations by department
const getDesignationsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const designations = await Designation.find({ 
      department: department,
      status: 1 
    }).sort({ order: 1, title: 1 });

    res.json(designations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designations for department' });
  }
};

module.exports = {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  toggleStatus,
  addEmployee,
  removeEmployee,
  getDesignationsByDepartment
};