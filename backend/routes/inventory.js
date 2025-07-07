import express from 'express';
import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

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

// GET /api/inventory
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/inventory
router.post('/', authenticateToken, async (req, res) => {
  const { clientId, itemName, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO inventory (clientId, itemName, description) VALUES (?, ?, ?)',
      [clientId, itemName, description]
    );
    const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/inventory/:id
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { clientId, itemName, description } = req.body;
  try {
    await pool.query(
      'UPDATE inventory SET clientId = ?, itemName = ?, description = ? WHERE id = ?',
      [clientId, itemName, description, id]
    );
    const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/inventory/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM inventory WHERE id = ?', [id]);
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 