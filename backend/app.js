import express from 'express';
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();

// Configuración básica de Multer
const upload = multer({ dest: 'uploads/' });

// Middleware para parsear JSON
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configuración CORS mejorada
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para logging de solicitudes (útil para debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes); 

export default app;