// app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';

// Route Imports
import storeRoutes from './routes/storeRoutes.js';
import demandRoutes from './routes/demandRoutes.js';
import restockRoutes from './routes/restockRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/demand', demandRoutes);
app.use('/api/restock', restockRoutes);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Central Error Handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Inventory Management API is running');
});

export default app;