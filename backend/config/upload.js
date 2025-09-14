import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const uniqueName = crypto.randomUUID();
      const extension = path.extname(file.originalname);
      cb(null, `${Date.now()}-${uniqueName}${extension}`);
    }
  });
};

const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
    }
  };
};

export const createUploader = (options = {}) => {
  const {
    destination = 'uploads/',
    maxSize = 5 * 1024 * 1024, 
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  } = options;
  
  return multer({
    storage: createStorage(destination),
    limits: { fileSize: maxSize },
    fileFilter: fileFilter(allowedTypes)
  });
};
