import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed.'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});
export default upload;
