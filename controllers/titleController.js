const Title = require('../models/Title');

// Get all titles
const getTitles = async (req, res) => {
  try {
    const titles = await Title.find().sort({ order: 1, createdAt: -1 });
    res.json(titles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch titles' });
  }
};

// Create new title
const createTitle = async (req, res) => {
  try {
    const { title, status = 1, isDefault = false, order = 0 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Check for duplicate
    const existingTitle = await Title.findOne({ 
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } 
    });

    if (existingTitle) {
      return res.status(400).json({ error: 'Title already exists' });
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Title.updateMany({}, { isDefault: false });
    }

    const newTitle = new Title({
      title: title.trim(),
      status,
      isDefault,
      order: parseInt(order) || 0,
      employees: []
    });

    const savedTitle = await newTitle.save();
    res.status(201).json(savedTitle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Title already exists' });
    }
    res.status(500).json({ error: 'Failed to create title' });
  }
};

// Update title
const updateTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, isDefault, order } = req.body;

    const titleDoc = await Title.findById(id);
    if (!titleDoc) {
      return res.status(404).json({ error: 'Title not found' });
    }

    // Check for duplicate (excluding current one)
    if (title && title.trim() !== titleDoc.title) {
      const existingTitle = await Title.findOne({
        _id: { $ne: id },
        title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
      });

      if (existingTitle) {
        return res.status(400).json({ error: 'Title already exists' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Title.updateMany({ _id: { $ne: id } }, { isDefault: false });
    }

    // Update fields
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (status !== undefined) updateData.status = status;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (order !== undefined) updateData.order = parseInt(order) || 0;

    const updatedTitle = await Title.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedTitle);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Title already exists' });
    }
    res.status(500).json({ error: 'Failed to update title' });
  }
};

// Delete title
const deleteTitle = async (req, res) => {
  try {
    const { id } = req.params;

    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    // Check if title has employees
    if (title.employees.length > 0) {
      return res.status(400).json({ error: 'Cannot delete title with assigned employees' });
    }

    // Check if it's default title
    if (title.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default title' });
    }

    await Title.findByIdAndDelete(id);
    res.json({ message: 'Title deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete title' });
  }
};

// Toggle title status
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    // Toggle status (1 to 0, 0 to 1)
    const newStatus = title.status === 1 ? 0 : 1;
    
    const updatedTitle = await Title.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    res.json(updatedTitle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle title status' });
  }
};

// Add employee to title
const addEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName } = req.body;

    if (!employeeName || !employeeName.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    // Check if employee already exists in this title
    if (title.employees.includes(employeeName.trim())) {
      return res.status(400).json({ error: 'Employee already exists in this title' });
    }

    title.employees.push(employeeName.trim());
    const updatedTitle = await title.save();

    res.json(updatedTitle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee to title' });
  }
};

// Remove employee from title
const removeEmployee = async (req, res) => {
  try {
    const { id, employeeName } = req.params;

    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    title.employees = title.employees.filter(
      emp => emp !== employeeName
    );

    const updatedTitle = await title.save();
    res.json(updatedTitle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove employee from title' });
  }
};

module.exports = {
  getTitles,
  createTitle,
  updateTitle,
  deleteTitle,
  toggleStatus,
  addEmployee,
  removeEmployee
};