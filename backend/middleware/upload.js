const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDirectoryIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create upload directories
const uploadsDir = path.join(__dirname, '../public/uploads');
const audioUploadsDir = path.join(__dirname, '../public/uploads/audio');
createDirectoryIfNotExists(uploadsDir);
createDirectoryIfNotExists(audioUploadsDir);

// Configure storage for general files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for audio files
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for general uploads
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only jpg, jpeg, png, pdf, doc, docx files are allowed.'), false);
  }
};

// File filter for audio uploads
const audioFilter = (req, file, cb) => {
  const allowedFileTypes = ['.mp3', '.wav', '.ogg', '.m4a'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid audio file type. Only mp3, wav, ogg, m4a files are allowed.'), false);
  }
};

// Exports for different upload types
exports.uploadFile = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('file');

exports.uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('audio');
