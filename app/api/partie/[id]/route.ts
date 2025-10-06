import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { RowDataPacket } from "mysql2"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const partieId = params.id

    if (!partieId) {
      return NextResponse.json({ error: "ID de partie requis" }, { status: 400 })
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT m1, m2, m3, m4, m5, m6, m7, public FROM partie WHERE id = ?",
      [partieId],
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Partie non trouvée" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Erreur lors de la récupération de la partie:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la récupération de la partie" }, { status: 500 })
  }
}
