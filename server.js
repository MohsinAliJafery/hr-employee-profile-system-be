const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Routes
const visaTypeRoutes = require('./routes/visaTypes');
const departmentRoutes = require('./routes/departments');
const designationRoutes = require('./routes/designations');
const titleRoutes = require('./routes/titles');
const countryRoutes = require('./routes/countries');
const cityRoutes = require('./routes/cities');
const nationalityRoutes = require('./routes/nationalities');
const qualificationRoutes = require('./routes/qualifications');
const placesRoutes = require('./routes/places');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();
const connectDB = require('./config/database');
connectDB();

const app = express();

['uploads/profile-pictures', 'uploads/documents'].forEach(dir => {
  if (!fs.existsSync(path.join(__dirname, dir))) {
    fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
  }
});

// ✅ CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://31.97.115.181:5173'
  ],
  credentials: true
}));

// ✅ JSON & URL Encoded Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visa-types', visaTypeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/titles', titleRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/nationalities', nationalityRoutes);
app.use('/api/qualifications', qualificationRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/employee-status', require('./routes/employee-status'));
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Running...' });
});

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
