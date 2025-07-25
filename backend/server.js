import app from './app.js';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();

app.use(cors());
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
