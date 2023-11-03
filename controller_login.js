// Importar las dependencias necesarias.
import { pool } from "./db.js";
import jwt from "jsonwebtoken";

// Función de login.
export const login = async (req, res) => {
  try {
    // Validar los datos de entrada.
    const { Nombre_usuario, Identificacion } = req.body;
    if (!Nombre_usuario || !Identificacion) {
      return res.status(400).json({ error: "Datos de entrada inválidos" });
    }

    // Consultar el usuario en la base de datos.
    const [result] = await pool.query(
      "SELECT * FROM usuarios WHERE Nombre_usuario=? AND Identificacion=?",
      [Nombre_usuario, Identificacion]
    );

    // Verificar si el usuario existe.
    if (result.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Generar el token JWT.
    const token_payload = {
      Id: result[0].Id,
      Nombre: result[0].Nombre,
      Nombre_usuario: Nombre_usuario,
      Identificacion: Identificacion,
    };
    const token = jwt.sign(token_payload, "SecretKey", { expiresIn: "100s" });

    // Guardar el token en una cookie.
    res.cookie("jwt", token, { httpOnly: true, maxAge: 30000 });

    // Enviar la respuesta al cliente.
    return res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ha ocurrido un error" });
  }
};

// Función para proteger una ruta.
export const protegida = (req, res) => {
  // Obtener el token de la cookie.
  const token = req.cookies.jwt;

  // Verificar si el token existe.
  if (!token) {
    return res.status(401).json({ error: "Acceso denegado" });
  }

  // Verificar la validez del token.
  jwt.verify(token, "SecretKey", (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: "Acceso denegado" });
    }

    // Si el token es válido, permitir el acceso a la ruta.
    return res.status(200).json({ message: "Acceso autorizado a la ruta protegida" });
  });
};
