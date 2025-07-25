import express from 'express';
import movieController from '../controllers/movieController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { body, validationResult } from 'express-validator';
import { upload } from '../controllers/movieController.js';

const router = express.Router();

const validateMovie = [
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('year').isInt({ min: 1888 }).withMessage('El año debe ser un número válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
const validateMovieUpdate = [
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('director').notEmpty().withMessage('El director es obligatorio'),
  body('genre').notEmpty().withMessage('El género es obligatorio'),
  body('year')
    .isInt({ min: 1888 }).withMessage('El año debe ser un número válido')
    .toInt(),
  body('score')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 10 }).withMessage('El puntaje debe ser entre 0 y 10'),
  body('watched').optional().isBoolean().withMessage('El campo watched debe ser booleano'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array(),
        receivedData: req.body // Para debug
      });
    }
    next();
  }
];

router.post(
  '/', 
  verifyToken, 
  upload.single('image'), 
  validateMovie, 
  movieController.createMovie
);

router.get('/', verifyToken, movieController.getAllMovies);
router.get('/:id', verifyToken, movieController.getMovieById);
router.put(
  '/:id', 
  verifyToken, 
  upload.single('image'), 
  validateMovieUpdate,  
  movieController.updateMovie
);
router.delete('/:id', verifyToken, movieController.deleteMovie);

export default router;
