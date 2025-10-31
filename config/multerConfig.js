const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const baseUploadDir = 'uploads';
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Dynamic storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Automatically create and use folders based on fieldname (optional)
    const folder = path.join(baseUploadDir, file.fieldname || 'others');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const safeOriginalName = file.originalname.replace(/\s+/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${safeOriginalName}`);
  },
});

// Accept **all** files, no MIME restrictions
const fileFilter = (req, file, cb) => {
  console.log(`📁 Upload received: ${file.fieldname} (${file.mimetype})`);
  cb(null, true);
};

// Create multer instance — unlimited fields, all file types
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Optional: limit 50MB per file
  },
});

module.exports = upload;
