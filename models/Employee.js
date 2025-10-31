// models/Employee.js
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institute: { type: String, required: true },
  passingYear: { type: String, required: true }
});

const employmentSchema = new mongoose.Schema({
  employerName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  employmentType: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Self-employed', 'Temporary', 'Seasonal', 'Volunteer', 'Other'] },
  companyAddress: { type: String, required: true },
  department: { type: String }, // Optional
  startDate: { type: String, required: true }, // YYYY-MM
  endDate: { type: String }, // YYYY-MM or 'Present'
  duration: { type: String },
  jobDescription: { type: String },
  reasonForLeaving: { type: String }
});

const documentSchema = new mongoose.Schema({
  documentType: { type: String },
  documentTitle: { type: String, required: true },
  description: { type: String },
  documentPath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const nextOfKinSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  relationship: { type: String, required: true, enum: ['Spouse', 'Parent', 'Child', 'Sibling', 'Grandparent', 'Grandchild', 'Friend', 'Colleague', 'Other'] },
  dateOfBirth: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  address: { type: String, required: true},
  city: { type: String, required: true},
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  employeeStatus: { type: String, required: true },
  alternatePhoneNumber: { type: String },
  email: { type: String, required:true },
  occupation: { type: String },
  isPrimary: { type: Boolean, default: false }
});

const employeeSchema = new mongoose.Schema({
  title: { type: mongoose.Schema.Types.ObjectId, ref: 'Title' },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'] },
  contactNo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  nationality: { type: String, required: true },
  address: { type: String, required: true },
  postCode: { type: String, required: true },
  visaType: { type: mongoose.Schema.Types.ObjectId, ref: 'VisaType' },
  visaExpiry: { type: String, required: true },
  nationalInsuranceNumber: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  profilePicture: { type: String }, // Path to file
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  jobTitle: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
  startDate: { type: String },
  salary: { type: Number },
  educations: [educationSchema],
  employments: [employmentSchema],
  documents: [documentSchema],
  nextOfKins: [nextOfKinSchema]
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);