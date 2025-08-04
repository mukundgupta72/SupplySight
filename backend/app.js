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

// ✅ CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5000"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
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

// Default route
app.get('/', (req, res) => {
  res.send('Inventory Management API is running');
});

export default app;
