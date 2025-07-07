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

// GET /api/chalans
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM chalans');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/chalans
router.post('/', authenticateToken, async (req, res) => {
  const { clientId, serialNumber, date, poDate, poNumber, vehicleNo, remarks, createdBy } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO chalans (clientId, serialNumber, date, poDate, poNumber, vehicleNo, remarks, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [clientId, serialNumber, date, poDate, poNumber, vehicleNo, remarks, createdBy]
    );
    const [rows] = await pool.query('SELECT * FROM chalans WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/chalans/:id
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { clientId, serialNumber, date, poDate, poNumber, vehicleNo, remarks, createdBy } = req.body;
  try {
    await pool.query(
      'UPDATE chalans SET clientId = ?, serialNumber = ?, date = ?, poDate = ?, poNumber = ?, vehicleNo = ?, remarks = ?, createdBy = ? WHERE id = ?',
      [clientId, serialNumber, date, poDate, poNumber, vehicleNo, remarks, createdBy, id]
    );
    const [rows] = await pool.query('SELECT * FROM chalans WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/chalans/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM chalans WHERE id = ?', [id]);
    res.json({ message: 'Chalan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 