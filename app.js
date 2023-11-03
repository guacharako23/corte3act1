// Importar las dependencias necesarias.
import express from "express";
import { pool } from "./db.js";
import { login, protegida } from "./controller_login.js";
import cookieParser from "cookie-parser";

// Crear una aplicación Express.
const app = express();

// Configurar el puerto.
const port = 3000;

// Usar middleware para parsear JSON y cookies.
app.use(express.json());
app.use(cookieParser());

// Definir una ruta para obtener la lista de usuarios.
app.get("/api", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM usuarios");
  res.json(result);
});

// Definir una ruta para iniciar sesión.
app.post("/login", login);

// Definir una ruta protegida.
app.get("/protected", protegida);

// Iniciar el servidor Express.
app.listen(port, () => {
  console.log(`Corriendo en el puerto ${port}`);
});
