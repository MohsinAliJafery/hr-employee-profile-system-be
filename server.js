const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const visaTypeRoutes = require('./routes/visaTypes')
const departmentRoutes = require('./routes/departments');
const designationRoutes = require('./routes/designations'); 
const titleRoutes = require('./routes/titles');
const countryRoutes = require('./routes/countries'); 
const cityRoutes = require('./routes/cities');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://31.97.115.181:5173'
  ],
  credentials: true
}));


// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/visa-types', visaTypeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/titles', titleRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/cities', cityRoutes); 

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Auth API is running!' });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});