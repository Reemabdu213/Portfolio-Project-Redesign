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

// GET all centers
router.get('/', async (req, res) => {
  try {
    const centers = await Center.findAll();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all centers for admin
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
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

// GET center for current logged-in center owner
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

// GET search centers by location
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

// GET center by id
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

// POST create center (with image upload)
router.post('/', auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'license_file', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, location, description, category } = req.body;
    const image = req.files?.image ? req.files.image[0].filename : null;
    const license_file = req.files?.license_file ? req.files.license_file[0].filename : null;

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

// PATCH approve center (admin)
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

// PATCH increment center views
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

// PATCH update center info
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

// DELETE center (admin)
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

// GET courses for a center
router.get('/:id/courses', async (req, res) => {
  try {
    const courses = await Course.findByCenterId(req.params.id);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
