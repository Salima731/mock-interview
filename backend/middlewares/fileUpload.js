const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamic upload path
const createUpload = (folderName) => {
  const uploadPath = path.join(__dirname, '..', 'uploads', folderName);
  fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  });

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/avif'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files (jpg, jpeg, png, webp, avif) are allowed.'));
    }
};

  return multer({
    storage,
    fileFilter,
    limits: { files: 10 }, // Max 10 files
  });
};

module.exports = createUpload;