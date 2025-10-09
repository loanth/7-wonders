import { NextResponse } from "next/server"
import pool from "@/lib/db" // ton fichier de connexion PostgreSQL

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time")
    return NextResponse.json({
      message: `Connexion réussie. Heure actuelle : ${result.rows[0].current_time}`,
    })
  } catch (error: any) {
    console.error("Erreur PostgreSQL :", error)
    return NextResponse.json(
      { error: error.message || "Erreur de connexion à PostgreSQL" },
      { status: 500 }
    )
  }
}
