import mysql from "mysql2/promise"

// Configuration de la connexion à la base de données
// Vous devez définir ces variables d'environnement dans votre projet Vercel
const pool = mysql.createPool({
  host: process.env.DB_HOST || "sql7.freesqldatabase.com",
  user: process.env.DB_USER || "sql7801927",
  password: process.env.DB_PASSWORD || "fYJkntyhEi",
  database: process.env.DB_NAME || "sql7801927",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
