// controllers/employeeController.js
const Employee = require('../models/Employee');
const fs = require('fs');
const path = require('path');
const { fileUpload } = require('../middleware/fileUpload');

// Helper to calculate duration
const calculateDuration = (startDate, endDate) => {
  if (!startDate) return '';
  const start = new Date(startDate + '-01'); // Append day for month input
  const end = endDate === 'Present' ? new Date() : new Date(endDate + '-01');
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  let totalMonths = years * 12 + months;
  if (totalMonths < 0) totalMonths = 0;
  const yearsPart = Math.floor(totalMonths / 12);
  const monthsPart = totalMonths % 12;
  const parts = [];
  if (yearsPart > 0) parts.push(`${yearsPart} year${yearsPart !== 1 ? 's' : ''}`);
  if (monthsPart > 0) parts.push(`${monthsPart} month${monthsPart !== 1 ? 's' : ''}`);
  return parts.join(' ') || '0 months';
};

// GET all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('title', 'title')
      .populate('country', 'name')
      .populate('city', 'name')
      .populate('visaType', 'type')
      .populate('department', 'name')
      .populate('jobTitle', 'name')
      .select('-__v'); // Exclude unnecessary fields
    res.json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employees' });
  }
};

// GET employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('title', 'title')
      .populate('country', 'name')
      .populate('city', 'name')
      .populate('visaType', 'type')
      .populate('department', 'name')
      .populate('jobTitle', 'name');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employee' });
  }
};

// CREATE employee (Personal Info Step) - Use fields for consistency
exports.createEmployee = [
  fileUpload,
  async (req, res) => {
    try {
      const profilePicture = req.files && req.files.profilePicture ? req.files.profilePicture[0].filename : null;
      const employeeData = {
        ...req.body,
        profilePicture,
        // Convert string IDs to ObjectId if needed (handled by Mongoose)
      };
      // Validate email and NIN uniqueness
      const existingEmail = await Employee.findOne({ email: req.body.email });
      if (existingEmail) {
        if (profilePicture) fs.unlinkSync(path.join('uploads/profile-pictures/', profilePicture));
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      const existingNIN = await Employee.findOne({ nationalInsuranceNumber: req.body.nationalInsuranceNumber });
      if (existingNIN) {
        if (profilePicture) fs.unlinkSync(path.join('uploads/profile-pictures/', profilePicture));
        return res.status(400).json({ success: false, message: 'National Insurance Number already exists' });
      }
      const employee = new Employee(employeeData);
      await employee.save();
      res.status(201).json({ success: true, data: employee });
    } catch (error) {
      console.error('Error creating employee:', error);
      // Cleanup files
      if (req.files) {
        if (req.files.profilePicture) fs.unlinkSync(path.join('uploads/profile-pictures/', req.files.profilePicture[0].filename));
        if (req.files.documentFiles) req.files.documentFiles.forEach(file => fs.unlinkSync(path.join('uploads/documents/', file.filename)));
      }
      res.status(500).json({ success: false, message: 'Failed to create employee' });
    }
  }
];

// UPDATE employee (for all steps: Education, Employment, Documents, NextOfKin)
exports.updateEmployee = [
  fileUpload, // Single middleware for all file fields
  async (req, res) => {
    try {
      let updates = { ...req.body };
      const employeeId = req.params.id;
      let existingEmployee = await Employee.findById(employeeId);
      if (!existingEmployee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

  // Handle profile picture update
if (req.files && req.files.profilePicture && req.files.profilePicture.length > 0) {
  // Delete old profile picture safely if exists
  if (existingEmployee.profilePicture) {
    const oldPath = path.join(__dirname, '..', existingEmployee.profilePicture);
    try {
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    } catch (error) {
      console.warn('Failed to delete old profile picture:', error.message);
    }
  }

  // ✅ Save the new relative path (not just the filename)
  updates.profilePicture = `uploads/profile-pictures/${req.files.profilePicture[0].filename}`;
}

      // Handle documents if documentFiles present
      if (req.files && req.files.documentFiles && req.files.documentFiles.length > 0) {
        let documentsJson;
        try {
          const docsStr = req.body.documents || '[]';
          documentsJson = typeof docsStr === 'string' ? JSON.parse(docsStr) : docsStr;
        } catch (e) {
          return res.status(400).json({ success: false, message: 'Invalid documents JSON' });
        }
        const newDocuments = documentsJson
          .filter(doc => !doc.documentPath) // Only new ones without path
          .map((doc, index) => ({
            ...doc,
            documentPath: req.files.documentFiles[index].filename,
            uploadedAt: new Date()
          }));
        const updatedDocuments = [
          ...existingEmployee.documents.filter(doc => doc.documentPath), // Keep existing
          ...newDocuments
        ];
        updates.documents = updatedDocuments;
        delete updates.documents; // Avoid overwriting with invalid JSON
      }

      // Handle nextOfKins if present
      if (req.body.nextOfKins !== undefined) {
        let nextOfKinsJson;
        try {
          const noksStr = req.body.nextOfKins;
          nextOfKinsJson = typeof noksStr === 'string' ? JSON.parse(noksStr) : noksStr;
          // Ensure at least one primary
          if (nextOfKinsJson.length > 0 && !nextOfKinsJson.some(kin => kin.isPrimary)) {
            nextOfKinsJson[0].isPrimary = true;
          }
          updates.nextOfKins = nextOfKinsJson;
        } catch (e) {
          return res.status(400).json({ success: false, message: 'Invalid nextOfKins JSON' });
        }
        delete updates.nextOfKins;
      }

      // Handle educations: append if present
      if (req.body.educations !== undefined) {
        let educationsJson;
        try {
          const edusStr = req.body.educations || '[]';
          educationsJson = typeof edusStr === 'string' ? JSON.parse(edusStr) : edusStr;
          const updatedEducations = [...(existingEmployee.educations || []), ...educationsJson];
          updates.educations = updatedEducations;
        } catch (e) {
          return res.status(400).json({ success: false, message: 'Invalid educations JSON' });
        }
        delete updates.educations;
      }

      // Handle employments: append if present
      if (req.body.employments !== undefined) {
        let employmentsJson;
        try {
          const empsStr = req.body.employments || '[]';
          employmentsJson = typeof empsStr === 'string' ? JSON.parse(empsStr) : empsStr;
          // Auto-calculate duration for new employments
          const updatedEmploymentsJson = employmentsJson.map(emp => ({
            ...emp,
            duration: calculateDuration(emp.startDate, emp.endDate)
          }));
          const updatedEmployments = [...(existingEmployee.employments || []), ...updatedEmploymentsJson];
          updates.employments = updatedEmployments;
        } catch (e) {
          return res.status(400).json({ success: false, message: 'Invalid employments JSON' });
        }
        delete updates.employments;
      }

      // For non-file updates (like Education, Employment, NextOfKin without files), req.body is already parsed
      // For file updates, fields are in req.body

      // Apply updates
      existingEmployee = await Employee.findByIdAndUpdate(employeeId, updates, { new: true, runValidators: true })
        .populate('title', 'title')
        .populate('country', 'name')
        .populate('city', 'name')
        .populate('visaType', 'type')
        .populate('department', 'name')
        .populate('jobTitle', 'name');

      // Validate uniqueness on update for email and NIN if changed
      if (req.body.email && req.body.email !== existingEmployee.email) {
        const emailCheck = await Employee.findOne({ email: req.body.email });
        if (emailCheck && emailCheck._id.toString() !== employeeId) {
          return res.status(400).json({ success: false, message: 'Email already exists' });
        }
      }
      if (req.body.nationalInsuranceNumber && req.body.nationalInsuranceNumber !== existingEmployee.nationalInsuranceNumber) {
        const ninCheck = await Employee.findOne({ nationalInsuranceNumber: req.body.nationalInsuranceNumber });
        if (ninCheck && ninCheck._id.toString() !== employeeId) {
          return res.status(400).json({ success: false, message: 'National Insurance Number already exists' });
        }
      }

      res.json({ success: true, data: existingEmployee });
    } catch (error) {
      console.error('Error updating employee:', error);
      // Cleanup files on error
      if (req.files) {
        if (req.files.profilePicture) {
          req.files.profilePicture.forEach(file => fs.unlinkSync(path.join('uploads/profile-pictures/', file.filename)));
        }
        if (req.files.documentFiles) {
          req.files.documentFiles.forEach(file => fs.unlinkSync(path.join('uploads/documents/', file.filename)));
        }
      }
      if (error.message.includes('Invalid JSON')) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Failed to update employee' });
      }
    }
  }
];

// DELETE employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    // Delete profile picture if exists
    if (employee.profilePicture) {
      fs.unlinkSync(path.join('uploads/profile-pictures/', employee.profilePicture));
    }
    // Delete documents
    if (employee.documents) {
      employee.documents.forEach(doc => {
        if (doc.documentPath) {
          fs.unlinkSync(path.join('uploads/documents/', doc.documentPath));
        }
      });
    }
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, message: 'Failed to delete employee' });
  }
};