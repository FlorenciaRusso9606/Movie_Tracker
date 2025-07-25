import express from 'express';
import { register, login } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validaciones para /register
const validateRegister = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .escape(),
  body('email')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validaciones para /login
const validateLogin = [
  body('email')
    .isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
