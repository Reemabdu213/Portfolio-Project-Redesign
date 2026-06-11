const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// رفع الصورة
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'jeel_centers' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });
    const fileExtension = req.file.originalname.split('.').pop();
    res.json({ url: result.secure_url + '.' + fileExtension });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// رفع الوثيقة
router.post('/document', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document provided' });
    }
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'jeel_documents', resource_type: 'raw' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
