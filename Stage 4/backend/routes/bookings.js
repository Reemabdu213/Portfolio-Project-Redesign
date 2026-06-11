const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { course_id, date } = req.body;
    const result = await pool.query(
      `INSERT INTO bookings (user_id, course_id, date, status) VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [req.user.id, course_id, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, co.name as course_name, co.price, co.duration, co.days, co.times, ce.name as center_name
       FROM bookings b
       JOIN courses co ON b.course_id = co.id
       JOIN centers ce ON co.center_id = ce.id
       WHERE b.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings (admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    const result = await pool.query(
      `SELECT b.*, u.email, co.name as course_name, ce.name as center_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN courses co ON b.course_id = co.id
       JOIN centers ce ON co.center_id = ce.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bookings for center
router.get('/center', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.email, co.name as course_name, ce.name as center_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN courses co ON b.course_id = co.id
       JOIN centers ce ON co.center_id = ce.id
       WHERE ce.owner_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
