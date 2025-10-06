import mysql from "mysql2/promise"

// Configuration de la connexion à la base de données
// Vous devez définir ces variables d'environnement dans votre projet Vercel
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "workshop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
