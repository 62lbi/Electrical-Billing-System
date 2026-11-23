const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure this 'uploads' folder exists in your project root directory
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Filter type of file (only allow standard image formats)
        const acceptedType = ['image/jpg', 'image/jpeg', 'image/png'];
        if (!acceptedType.includes(file.mimetype)) {
            cb(null, false);
            return cb(new Error(`Invalid file type (${file.mimetype}). Only JPG, JPEG, and PNG are allowed!`));
        }

        // Filter size of file (e.g., max 2MB)
        const fileSize = req.headers['content-length'];
        const maxSize = 2 * 1024 * 1024; // 2 MB
        if (fileSize > maxSize) {
            cb(null, false);
            return cb(new Error('File size is too large. Maximum allowed size is 2MB.'));
        }

        cb(null, true);
    }
});

module.exports = upload;