const express = require('express');
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDF and Word documents are allowed!'), false);
    }
  }
});

// Enhanced Helper function to parse form data with better file handling
const parseFormData = (req) => {
  console.log('=== PARSING FORM DATA ===');
  
  const {
    firstName,
    lastName,
    country,
    city,
    nationality,
    address,
    visaType,
    visaExpiry,
    department,
    jobTitle,
    startDate,
    salary,
    isActive
  } = req.body;

  // Parse educations
  let educations = [];
  if (req.body.educations) {
    try {
      educations = JSON.parse(req.body.educations);
      console.log(`✅ Parsed ${educations.length} education entries`);
    } catch (error) {
      console.error('❌ Error parsing educations:', error);
    }
  }

  // Log all received files
  console.log(`📁 Total files received: ${req.files?.length || 0}`);
  if (req.files) {
    req.files.forEach((file, index) => {
      console.log(`File ${index}: ${file.fieldname} -> ${file.filename}`);
    });
  }

  // Enhanced file handling with multiple strategies
  const educationFiles = {};
  
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      // Strategy 1: Handle indexed fieldnames (educationFiles[0], educationFiles[1])
      if (file.fieldname.startsWith('educationFiles[')) {
        const match = file.fieldname.match(/educationFiles\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          educationFiles[index] = {
            filename: file.filename,
            originalname: file.originalname
          };
          console.log(`✅ Indexed assignment: File '${file.originalname}' -> education[${index}]`);
        }
      }
      // Strategy 2: Handle sequential educationFiles (fallback)
      else if (file.fieldname === 'educationFiles') {
        // Find the first available education index without a file
        for (let i = 0; i < educations.length; i++) {
          if (!educationFiles[i]) {
            educationFiles[i] = {
              filename: file.filename,
              originalname: file.originalname
            };
            console.log(`✅ Sequential assignment: File '${file.originalname}' -> education[${i}]`);
            break;
          }
        }
      }
    });
  }

  // Assign files to educations with validation
  educations.forEach((edu, index) => {
    if (educationFiles[index]) {
      edu.documentPath = educationFiles[index].filename;
      console.log(`✅ Final assignment: education[${index}] -> '${educationFiles[index].originalname}'`);
    } else {
      console.log(`❌ No file assigned for education[${index}]`);
      // Ensure documentPath exists even if no file
      if (!edu.documentPath) {
        edu.documentPath = '';
      }
    }
  });

  // Handle visa file
  const visaFile = req.files?.find(file => file.fieldname === 'visaFile');
  const visaDocumentPath = visaFile ? visaFile.filename : '';

  if (visaFile) {
    console.log(`✅ Visa file assigned: ${visaFile.originalname}`);
  }

  console.log('=== FINAL PARSED DATA ===');
  console.log('Educations with files:', educations);
  
  return {
    firstName,
    lastName,
    country,
    city,
    nationality,
    address,
    visaType,
    visaExpiry,
    visaDocumentPath,
    department,
    jobTitle,
    startDate,
    salary: parseFloat(salary),
    isActive: isActive !== undefined ? isActive === 'true' : true,
    educations
  };
};

// @desc    Get all employees for logged in user
// @route   GET /api/employees
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    console.log('Fetching employees for user:', req.user.id);
    
    const employees = await Employee.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    console.log('Found employees:', employees.length);
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employees'
    });
  }
});

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
router.post('/', protect, upload.any(), async (req, res) => {
  try {
    console.log('=== CREATING NEW EMPLOYEE ===');
    const formData = parseFormData(req);

    // Validation
    const requiredFields = [
      'firstName', 'lastName', 'country', 'city', 'nationality', 'address',
      'visaType', 'visaExpiry', 'department', 'jobTitle', 'startDate', 'salary'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate educations
    if (!formData.educations || formData.educations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one education entry is required'
      });
    }

    for (const edu of formData.educations) {
      if (!edu.degree || !edu.institute || !edu.passingYear) {
        return res.status(400).json({
          success: false,
          message: 'All education fields (degree, institute, passing year) are required'
        });
      }
    }

    console.log('✅ All validations passed, creating employee...');

    // Create employee
    const employee = await Employee.create({
      ...formData,
      createdBy: req.user.id
    });

    console.log('✅ Employee created successfully:', employee._id);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('❌ Create employee error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating employee'
    });
  }
});

// @desc    Update employee
// @route   PATCH /api/employees/:id
// @access  Private
router.patch('/:id', protect, upload.any(), async (req, res) => {
  try {
    console.log('=== UPDATING EMPLOYEE ===');
    
    let employee = await Employee.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Parse the incoming form data
    const updateData = parseFormData(req);

    // Start with existing employee data and merge updates
    const finalUpdateData = {};

    // Handle basic fields - only update if provided
    const basicFields = [
      'firstName', 'lastName', 'country', 'city', 'nationality', 'address',
      'visaType', 'visaExpiry', 'department', 'jobTitle', 'startDate', 'salary', 'isActive'
    ];

    basicFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'salary') {
          finalUpdateData[field] = parseFloat(updateData[field]);
        } else if (field === 'isActive') {
          finalUpdateData[field] = updateData[field] === 'true';
        } else {
          finalUpdateData[field] = updateData[field];
        }
      }
    });

    // Handle visa document path
    let finalVisaDocumentPath = employee.visaDocumentPath;
    if (updateData.visaDocumentPath !== undefined) {
      finalVisaDocumentPath = updateData.visaDocumentPath;
    }
    finalUpdateData.visaDocumentPath = finalVisaDocumentPath;

    // Handle educations - use the parsed educations directly
    if (updateData.educations && updateData.educations.length > 0) {
      finalUpdateData.educations = updateData.educations;
    }

    // Validate required fields if they are being updated
    const requiredFields = [
      'firstName', 'lastName', 'country', 'city', 'nationality', 'address',
      'visaType', 'visaExpiry', 'department', 'jobTitle', 'startDate', 'salary'
    ];

    for (const field of requiredFields) {
      if (finalUpdateData[field] !== undefined && !finalUpdateData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    console.log('✅ Final update data:', finalUpdateData);

    // Update employee
    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      finalUpdateData,
      { new: true, runValidators: true }
    );

    console.log('✅ Employee updated successfully');

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('❌ Update employee error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating employee'
    });
  }
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    let employee = await Employee.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting employee'
    });
  }
});

// Get employee by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('❌ Get employee by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employee',
    });
  }
});

// Add this to serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;