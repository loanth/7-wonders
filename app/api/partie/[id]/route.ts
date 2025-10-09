import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db" // connexion PostgreSQL (pg.Pool)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const partieId = Number(params.id)

    if (!partieId || Number.isNaN(partieId)) {
      return NextResponse.json({ error: "ID de partie requis" }, { status: 400 })
    }

    // Requête PostgreSQL
    const result = await pool.query(
      `SELECT m1, m2, m3, m4, m5, m6, m7, public 
       FROM workshop_partie 
       WHERE id = $1`,
      [partieId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Partie non trouvée" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erreur lors de la récupération de la partie :", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération de la partie" },
      { status: 500 }
    )
  }
}
