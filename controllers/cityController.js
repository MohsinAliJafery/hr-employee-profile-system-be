const City = require('../models/City');
const Country = require('../models/Country');

// Get all cities with country details
const getCities = async (req, res) => {
  try {
    const cities = await City.find()
      .populate('countryId', 'name')
      .sort({ order: 1, createdAt: -1 });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

// Get all countries for dropdown
const getCountries = async (req, res) => {
  try {
    const countries = await Country.find({ status: 1 }).sort({ name: 1 });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

// Create new city
const createCity = async (req, res) => {
  try {
    const { name, countryId, status = 1, isDefault = false, order = 0 } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'City name is required' });
    }

    if (!countryId) {
      return res.status(400).json({ error: 'Country is required' });
    }

    // Check for duplicate city name in the same country
    const existingCity = await City.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      countryId: countryId
    });

    if (existingCity) {
      return res.status(400).json({ error: 'City already exists in this country' });
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await City.updateMany({}, { isDefault: false });
    }

    const newCity = new City({
      name: name.trim(),
      countryId,
      status,
      isDefault,
      order: parseInt(order) || 0,
      employees: []
    });

    const savedCity = await newCity.save();
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
const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, countryId, status, isDefault, order } = req.body;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Check for duplicate (excluding current one)
    if ((name && name.trim() !== city.name) || countryId !== city.countryId.toString()) {
      const existingCity = await City.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name?.trim() || city.name}$`, 'i') },
        countryId: countryId || city.countryId
      });

      if (existingCity) {
        return res.status(400).json({ error: 'City already exists in this country' });
      }
    }

    // If setting as default, remove default from others
    if (isDefault) {
      await City.updateMany({ _id: { $ne: id } }, { isDefault: false });
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (countryId !== undefined) updateData.countryId = countryId;
    if (status !== undefined) updateData.status = status;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (order !== undefined) updateData.order = parseInt(order) || 0;

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
const deleteCity = async (req, res) => {
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
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Toggle status (1 to 0, 0 to 1)
    const newStatus = city.status === 1 ? 0 : 1;
    
    const updatedCity = await City.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    ).populate('countryId', 'name');

    res.json(updatedCity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle city status' });
  }
};

// Add employee to city
const addEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName } = req.body;

    if (!employeeName || !employeeName.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Check if employee already exists in this city
    if (city.employees.includes(employeeName.trim())) {
      return res.status(400).json({ error: 'Employee already exists in this city' });
    }

    city.employees.push(employeeName.trim());
    const updatedCity = await city.save();

    res.json(updatedCity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee to city' });
  }
};

// Remove employee from city
const removeEmployee = async (req, res) => {
  try {
    const { id, employeeName } = req.params;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    city.employees = city.employees.filter(
      emp => emp !== employeeName
    );

    const updatedCity = await city.save();
    res.json(updatedCity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove employee from city' });
  }
};

// Get cities by country
const getCitiesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    
    const cities = await City.find({ 
      countryId: countryId,
      status: 1 
    })
    .populate('countryId', 'name')
    .sort({ order: 1, name: 1 });

    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities for country' });
  }
};

module.exports = {
  getCities,
  getCountries,
  createCity,
  updateCity,
  deleteCity,
  toggleStatus,
  addEmployee,
  removeEmployee,
  getCitiesByCountry
};