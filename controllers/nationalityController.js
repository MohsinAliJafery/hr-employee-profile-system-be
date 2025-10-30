const Nationality = require('../models/Nationality');

// Get all nationalities
const getNationalities = async (req, res) => {
  try {
    const nationalities = await Nationality.find().sort({ order: 1, createdAt: -1 });
    res.json(nationalities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nationalities' });
  }
};

// Create new nationality
const createNationality = async (req, res) => {
  try {
    const { name, status = 1, isDefault = false, order = 0 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nationality name is required' });
    }

    // Check for duplicate nationality
    const existingNationality = await Nationality.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingNationality) {
      return res.status(400).json({ error: 'Nationality already exists' });
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Nationality.updateMany({}, { isDefault: false });
    }

    const newNationality = new Nationality({
      name: name.trim(),
      status,
      isDefault,
      order: parseInt(order) || 0,
      citizens: []
    });

    const savedNationality = await newNationality.save();
    res.status(201).json(savedNationality);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Nationality already exists' });
    }
    res.status(500).json({ error: 'Failed to create nationality' });
  }
};

// Update nationality
const updateNationality = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, isDefault, order } = req.body;

    const nationality = await Nationality.findById(id);
    if (!nationality) {
      return res.status(404).json({ error: 'Nationality not found' });
    }

    // Check for duplicate (excluding current one)
    if (name && name.trim() !== nationality.name) {
      const existingNationality = await Nationality.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });

      if (existingNationality) {
        return res.status(400).json({ error: 'Nationality already exists' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Nationality.updateMany(
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

    const updatedNationality = await Nationality.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedNationality);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Nationality already exists' });
    }
    res.status(500).json({ error: 'Failed to update nationality' });
  }
};

// Delete nationality
const deleteNationality = async (req, res) => {
  try {
    const { id } = req.params;

    const nationality = await Nationality.findById(id);
    if (!nationality) {
      return res.status(404).json({ error: 'Nationality not found' });
    }

    // Check if nationality has citizens
    if (nationality.citizens.length > 0) {
      return res.status(400).json({ error: 'Cannot delete nationality with assigned citizens' });
    }

    await Nationality.findByIdAndDelete(id);
    res.json({ message: 'Nationality deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete nationality' });
  }
};

// Toggle nationality status
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const nationality = await Nationality.findById(id);
    if (!nationality) {
      return res.status(404).json({ error: 'Nationality not found' });
    }

    // Toggle status (1 to 0, 0 to 1)
    const newStatus = nationality.status === 1 ? 0 : 1;
    
    const updatedNationality = await Nationality.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    res.json(updatedNationality);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle nationality status' });
  }
};

// Add citizen to nationality
const addCitizen = async (req, res) => {
  try {
    const { id } = req.params;
    const { citizenName } = req.body;

    if (!citizenName || !citizenName.trim()) {
      return res.status(400).json({ error: 'Citizen name is required' });
    }

    const nationality = await Nationality.findById(id);
    if (!nationality) {
      return res.status(404).json({ error: 'Nationality not found' });
    }

    // Check if citizen already exists in this nationality
    if (nationality.citizens.includes(citizenName.trim())) {
      return res.status(400).json({ error: 'Citizen already exists in this nationality' });
    }

    nationality.citizens.push(citizenName.trim());
    const updatedNationality = await nationality.save();

    res.json(updatedNationality);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add citizen to nationality' });
  }
};

// Remove citizen from nationality
const removeCitizen = async (req, res) => {
  try {
    const { id, citizenName } = req.params;

    const nationality = await Nationality.findById(id);
    if (!nationality) {
      return res.status(404).json({ error: 'Nationality not found' });
    }

    nationality.citizens = nationality.citizens.filter(
      citizen => citizen !== citizenName
    );

    const updatedNationality = await nationality.save();
    res.json(updatedNationality);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove citizen from nationality' });
  }
};

module.exports = {
  getNationalities,
  createNationality,
  updateNationality,
  deleteNationality,
  toggleStatus,
  addCitizen,
  removeCitizen
};