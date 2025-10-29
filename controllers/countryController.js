const Country = require('../models/Country');

// Get all countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ createdAt: -1 });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

// Create new country
exports.createCountry = async (req, res) => {
  try {
    const { name, isActive = true, isDefault = false } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Country name is required' });
    }

    // Check for duplicate country
    const existingCountry = await Country.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (existingCountry) {
      return res.status(400).json({ error: 'Country already exists' });
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Country.updateMany({}, { isDefault: false });
    }

    const newCountry = new Country({
      name: name.trim(),
      isActive,
      isDefault,
      employees: []
    });

    const savedCountry = await newCountry.save();
    res.status(201).json(savedCountry);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Country already exists' });
    }
    res.status(500).json({ error: 'Failed to create country' });
  }
};

// Update country
exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive, isDefault } = req.body;

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Check for duplicate (excluding current one)
    if (name && name.trim() !== country.name) {
      const existingCountry = await Country.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });

      if (existingCountry) {
        return res.status(400).json({ error: 'Country already exists' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await Country.updateMany({ _id: { $ne: id } }, { isDefault: false });
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedCountry);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Country already exists' });
    }
    res.status(500).json({ error: 'Failed to update country' });
  }
};

// Delete country
exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Check if country has employees
    if (country.employees.length > 0) {
      return res.status(400).json({ error: 'Cannot delete country with assigned employees' });
    }

    // Check if it's default country
    if (country.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default country' });
    }

    await Country.findByIdAndDelete(id);
    res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete country' });
  }
};

// Toggle country status
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    country.isActive = !country.isActive;
    const updatedCountry = await country.save();

    res.json(updatedCountry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle country status' });
  }
};

// Add employee to country
exports.addEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName } = req.body;

    if (!employeeName) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Check if employee already exists
    if (country.employees.includes(employeeName)) {
      return res.status(400).json({ error: 'Employee already exists in this country' });
    }

    country.employees.push(employeeName);
    const updatedCountry = await country.save();

    res.json(updatedCountry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

// Remove employee from country
exports.removeEmployee = async (req, res) => {
  try {
    const { id, employeeName } = req.params;

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    country.employees = country.employees.filter(emp => emp !== employeeName);
    const updatedCountry = await country.save();

    res.json(updatedCountry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove employee' });
  }
};