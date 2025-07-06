import express from 'express';
import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Middleware to authenticate and set req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// GET /api/users/me - View profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, role, isRoot FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/me - Delete profile
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 