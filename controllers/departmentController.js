const Department = require('../models/Department');

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ order: 1, createdAt: -1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const { name, isDefault = false, order = 0 } = req.body;

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
      isDefault,
      order: parseInt(order) || 0,
      employees: [],
      status: 1
    });

    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, isDefault, order } = req.body;

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
    if (order !== undefined) updateData.order = parseInt(order) || 0;

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
const deleteDepartment = async (req, res) => {
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

    await Department.findByIdAndDelete(id);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

// Toggle department status
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Toggle status (1 to 0, 0 to 1)
    const newStatus = department.status === 1 ? 0 : 1;
    
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle department status' });
  }
};

// Add employee to department
const addEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName } = req.body;

    if (!employeeName || !employeeName.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Check if employee already exists in this department
    if (department.employees.includes(employeeName.trim())) {
      return res.status(400).json({ error: 'Employee already exists in this department' });
    }

    department.employees.push(employeeName.trim());
    const updatedDepartment = await department.save();

    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee to department' });
  }
};

// Remove employee from department
const removeEmployee = async (req, res) => {
  try {
    const { id, employeeName } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    department.employees = department.employees.filter(
      emp => emp !== employeeName
    );

    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove employee from department' });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleStatus,
  addEmployee,
  removeEmployee
};