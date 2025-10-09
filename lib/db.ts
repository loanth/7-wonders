import pkg from "pg";
const { Pool } = pkg;

// Configuration de la connexion à la base de données
// (tu peux garder les mêmes variables d’environnement)
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "workshop1",
  port: process.env.DB_PORT || 5432,
  max: 10, // équivaut à connectionLimit
  idleTimeoutMillis: 0,
});

export default pool;
