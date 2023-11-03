// Importar la dependencia necesaria.
import { createPool } from "mysql2/promise";

// Crear un pool de conexiones a MySQL.
export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "logins",
});
