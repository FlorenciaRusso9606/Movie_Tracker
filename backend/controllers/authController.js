import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const register = async (req, res) =>{
    const {name, email, password} = req.body;
    if(!name ||!email || !password){
        res.status(400).json({error: 'No ingresó todos los datos requeridos'});
    }
    try{
        // existe el usuario?
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if(existing.length>0){
            return res.status(409).json({error: 'El usuario ya existe'})
        }
        // hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword])
    const [users] = await db.query('SELECT idUser, name, email FROM users WHERE idUser = ?', [result.insertId]);
const user = users[0];



    // Firmar JWT
    const token = jwt.sign(
      { idUser: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

   res.status(201).json({
  token,
  user: {
    idUser: result.insertId,  
    name,
    email
  }
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { idUser: user.idUser, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

res.json({
  token,
  user: { 
    idUser: user.idUser,  
    name: user.name,
    email: user.email,
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

