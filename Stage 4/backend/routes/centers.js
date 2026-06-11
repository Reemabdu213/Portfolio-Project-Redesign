const express = require('express');
const router = express.Router();
const Center = require('../models/Center');
const auth = require('../middleware/auth');
const pool = require('../config/db');
const Course = require('../models/Course');
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const centers = await Center.findAll();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !location || !description) {
      return res.status(400).json({
        message: "Name, location, and description are required",
      });
    }
    const result = await pool.query(
      `SELECT id, name, location, description, approved, 
              image, license_file, views, owner_id, created_at 
       FROM centers 
       ORDER BY approved ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM centers WHERE owner_id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ message: 'Location query is required' });
    }
    const centers = await Center.findByLocation(location);
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM centers WHERE owner_id = $1',
      [req.user.id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    const result = await pool.query(
      'SELECT * FROM centers ORDER BY approved ASC'
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, location, description, image, category, license_file } = req.body;
    if (!name || !location || !description) {
      return res.status(400).json({ message: 'Name, location, and description are required' });
    }
    const center = await Center.create({ 
      name, location, description, image, category, license_file,
      owner_id: req.user.id 
    });
    res.status(201).json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    const center = await Center.approve(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/view', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE centers SET views = views + 1 WHERE id = $1 RETURNING views`,
      [req.params.id]
    );
    res.json({ views: result.rows[0].views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    await pool.query('DELETE FROM centers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Center deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/courses', async (req, res) => {
  try {
    const courses = await Course.findByCenterId(req.params.id);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, location, description, image } = req.body;

    const result = await pool.query(
      `UPDATE centers
       SET name = COALESCE($1, name),
           location = COALESCE($2, location),
           description = COALESCE($3, description),
           image = COALESCE($4, image)
       WHERE id = $5
       RETURNING *`,
      [name, location, description, image, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

