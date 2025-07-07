import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import usersRouter from './routes/users.js';
import clientsRouter from './routes/clients.js';
import inventoryRouter from './routes/inventory.js';
import chalansRouter from './routes/chalans.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Creative Prints Backend API is running!' });
});

// TODO: Add route imports here

app.use('/api/users', usersRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/chalans', chalansRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 