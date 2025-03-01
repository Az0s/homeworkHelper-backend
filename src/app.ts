import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db';
import { PORT, UPLOAD_DIR } from './config/env';

// Import routes
import accountRoutes from './routes/accountRoutes';
import courseworkRoutes from './routes/courseworkRoutes';
import tutorialRoutes from './routes/tutorialRoutes';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', UPLOAD_DIR)));

// Routes
app.use('/api/account', accountRoutes);
app.use('/api/coursework', courseworkRoutes);
app.use('/api/tutorial', tutorialRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Educational Platform API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 