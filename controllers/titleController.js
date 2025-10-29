const Title = require('../models/Title');

// Get all titles
exports.getTitles = async (req, res) => {
  try {
    const titles = await Title.find().sort({ createdAt: -1 });
    res.json(titles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch titles' });
  }
};

// Create new title
exports.createTitle = async (req, res) => {
  try {
    const { title, isActive = true, isDefault = false } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Check for duplicate title
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
      isActive,
      isDefault
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
exports.updateTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive, isDefault } = req.body;

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
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

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
exports.deleteTitle = async (req, res) => {
  try {
    const { id } = req.params;

    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
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
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    title.isActive = !title.isActive;
    const updatedTitle = await title.save();

    res.json(updatedTitle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle title status' });
  }
};