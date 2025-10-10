import pkg from "pg";
const { Pool } = pkg;

// Configuration de la connexion à la base de données Neon
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_UnsD8dWLePg3@ep-shiny-salad-aev7uyy8-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  ssl: { rejectUnauthorized: false }, // obligatoire pour Neon
  max: 10, // nombre maximum de connexions dans le pool
  idleTimeoutMillis: 0,
});

export default pool;
