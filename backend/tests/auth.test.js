import request from 'supertest';
import app from '../server.js';
import { login, register } from '../controllers/authController.js';

describe('Auth API', () => {
  it('Debería registrar un usuario con datos válidos', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('No debería registrar con email inválido', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'noemail',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toBe('Debe ser un email válido');
  });

  it('Debería hacer login con usuario registrado', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
