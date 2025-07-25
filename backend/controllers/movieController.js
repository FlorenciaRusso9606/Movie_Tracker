import db from '../db.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

// Configuración mejorada de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});
// Obtener todas las películas del usuario autenticado
const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const userId = req.user.idUser;

    //  Obtener las películas paginadas
    const [movies] = await db.query(
      `SELECT 
        idMovie, 
        idUser, 
        title, 
        director, 
        genre, 
        score, 
        review, 
        year, 
        watched, 
        image_url, 
        created_at 
       FROM movie 
       WHERE idUser = ? 
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    // Obtener el conteo total
    const [countResult] = await db.query(
      'SELECT COUNT(*) AS total FROM movie WHERE idUser = ?',
      [userId]
    );

    const total = countResult[0].total;

    res.json({
      data: movies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error('Error al obtener películas:', err);
    res.status(500).json({ 
      error: 'Error al obtener las películas',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


// Obtener una película por ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('SELECT * FROM movie WHERE idMovie = ?', [id]);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al traer la película' });
  }
};

// Crear película con imagen local o URL
const createMovie = async (req, res) => {
  try {
    const { title, director, genre, score, review, year, watched } = req.body;
    const imageUrl = req.body.imageUrl;
    
    if (!title || !director || !genre || !year) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Manejo de imagen mejorado
    let imagePath = null;
    if (req.file) {
      imagePath = `uploads/${req.file.filename}`;
    } else if (imageUrl?.trim()) {
      try {
        new URL(imageUrl); // Validar que sea una URL válida
        imagePath = imageUrl;
      } catch {
        return res.status(400).json({ error: 'URL de imagen no válida' });
      }
    }

    const userId = req.user.idUser;
    
    const [result] = await db.query(
      `INSERT INTO movie 
       (idUser, title, director, genre, score, review, year, watched, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        title, 
        director, 
        genre, 
        score || null, 
        review || null, 
        year, 
        watched === 'true' || watched === true, 
        imagePath  
      ]
    );

    res.status(201).json({ 
      id: result.insertId,
      message: 'Película creada correctamente',
      movie: {
        idMovie: result.insertId,
        title,
        director,
        genre,
        year,
        watched: watched === 'true' || watched === true,
        score: score || null,
        review: review || null,
        image_url: imagePath  
      }
    });
  } catch (err) {
    console.error('Error en createMovie:', err);
    res.status(500).json({ 
      error: 'Error al crear la película',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar película con manejo mejorado de imágenes
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.idUser;

    const [currentMovie] = await db.query(
      'SELECT * FROM movie WHERE idMovie = ? AND idUser = ?',
      [id, userId]
    );

    if (!currentMovie.length) {
      return res.status(404).json({ 
        error: 'Película no encontrada o no tienes permiso para editarla' 
      });
    }

    const requiredFields = ['title', 'director', 'genre', 'year'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `El campo ${field} es requerido`,
          receivedData: req.body
        });
      }
    }

    let imagePath = currentMovie[0].image_url;
    if (req.file) {
      imagePath = `uploads/${req.file.filename}`;
      // Opcional: eliminar la imagen anterior si existe
      if (currentMovie[0].image_url && !currentMovie[0].image_url.startsWith('http')) {
        try {
          fs.unlinkSync(path.join(process.cwd(), currentMovie[0].image_url));
        } catch (err) {
          console.error('Error al eliminar imagen anterior:', err);
        }
      }
    } else if (req.body.imageUrl !== undefined) {
      if (req.body.imageUrl === '') {
        imagePath = null;
      } else {
        try {
          new URL(req.body.imageUrl); // Validar URL
          imagePath = req.body.imageUrl;
        } catch {
          return res.status(400).json({ error: 'URL de imagen no válida' });
        }
      }
    }

    await db.query(
      `UPDATE movie SET 
        title = ?, director = ?, genre = ?, 
        year = ?, score = ?, review = ?, 
        watched = ?, image_url = ?
       WHERE idMovie = ?`,
      [
        req.body.title,
        req.body.director,
        req.body.genre,
        parseInt(req.body.year),
        req.body.score ? parseFloat(req.body.score) : null,
        req.body.review || null,
        req.body.watched === 'true' || req.body.watched === true,
        imagePath,
        id
      ]
    );

    const [updatedMovie] = await db.query('SELECT * FROM movie WHERE idMovie = ?', [id]);
    res.json({ 
      success: true,
      movie: updatedMovie[0]
    });

  } catch (err) {
    console.error('Error en updateMovie:', err);
    res.status(500).json({ 
      error: 'Error al actualizar la película',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar una película
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM movie WHERE idMovie = ?', [id]);
    res.json({ message: 'Película eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al borrar la película' });
  }
};

export default {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
