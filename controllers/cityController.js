const City = require('../models/City');
const Country = require('../models/Country');

// Get all cities with country details
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find()
      .populate('countryId', 'name')
      .sort({ createdAt: -1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

// Get countries for dropdown
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true }).select('name');
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

// Create new city
exports.createCity = async (req, res) => {
  try {
    const { name, countryId, isActive = true, isDefault = false } = req.body;

    if (!name || !countryId) {
      return res.status(400).json({ error: 'City name and country are required' });
    }

    // Check if country exists
    const country = await Country.findById(countryId);
    if (!country) {
      return res.status(400).json({ error: 'Country not found' });
    }

    // Check for duplicate city in the same country
    const existingCity = await City.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      countryId
    });

    if (existingCity) {
      return res.status(400).json({ error: 'City already exists in this country' });
    }

    // If setting as default, remove default from others in the same country
    if (isDefault) {
      await City.updateMany({ countryId }, { isDefault: false });
    }

    const newCity = new City({
      name: name.trim(),
      countryId,
      employees: [],
      isActive,
      isDefault
    });

    const savedCity = await newCity.save();
    
    // Populate country name for response
    const populatedCity = await City.findById(savedCity._id).populate('countryId', 'name');
    res.status(201).json(populatedCity);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'City already exists in this country' });
    }
    res.status(500).json({ error: 'Failed to create city' });
  }
};

// Update city
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, countryId, isActive, isDefault } = req.body;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Check if new country exists
    if (countryId) {
      const country = await Country.findById(countryId);
      if (!country) {
        return res.status(400).json({ error: 'Country not found' });
      }
    }

    // Check for duplicate (excluding current one)
    if ((name && name !== city.name) || (countryId && countryId !== city.countryId.toString())) {
      const existingCity = await City.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${(name || city.name).trim()}$`, 'i') },
        countryId: countryId || city.countryId
      });

      if (existingCity) {
        return res.status(400).json({ error: 'City already exists in this country' });
      }
    }

    // If setting as default, remove default from others in the same country
    if (isDefault) {
      const targetCountryId = countryId || city.countryId;
      await City.updateMany(
        { _id: { $ne: id }, countryId: targetCountryId },
        { isDefault: false }
      );
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (countryId !== undefined) updateData.countryId = countryId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedCity = await City.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('countryId', 'name');

    res.json(updatedCity);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'City already exists in this country' });
    }
    res.status(500).json({ error: 'Failed to update city' });
  }
};

// Delete city
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Check if city has employees
    if (city.employees.length > 0) {
      return res.status(400).json({ error: 'Cannot delete city with assigned employees' });
    }

    // Check if it's default city
    if (city.isDefault) {
      return res.status(400).json({ error: 'Cannot delete default city' });
    }

    await City.findByIdAndDelete(id);
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
};

// Toggle city status
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    city.isActive = !city.isActive;
    const updatedCity = await city.save();
    const populatedCity = await City.findById(updatedCity._id).populate('countryId', 'name');

    res.json(populatedCity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle city status' });
  }
};

// Add employee to city
exports.addEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName } = req.body;

    if (!employeeName) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Check if employee already exists
    if (city.employees.includes(employeeName)) {
      return res.status(400).json({ error: 'Employee already exists in this city' });
    }

    city.employees.push(employeeName);
    const updatedCity = await city.save();
    const populatedCity = await City.findById(updatedCity._id).populate('countryId', 'name');

    res.json(populatedCity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

// Remove employee from city
exports.removeEmployee = async (req, res) => {
  try {
    const { id, employeeName } = req.params;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    city.employees = city.employees.filter(emp => emp !== employeeName);
    const updatedCity = await city.save();
    const populatedCity = await City.findById(updatedCity._id).populate('countryId', 'name');

    res.json(populatedCity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove employee' });
  }
};