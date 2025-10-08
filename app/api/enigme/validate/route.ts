import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { ResultSetHeader } from "mysql2"

export async function POST(request: NextRequest) {
  try {
    const { partieId, enigmeId } = await request.json()

    if (!partieId || !enigmeId) {
      return NextResponse.json({ error: "ID de partie et ID d'énigme requis" }, { status: 400 })
    }

    // Valider que l'énigme est entre 1 et 7
    if (enigmeId < 1 || enigmeId > 7) {
      return NextResponse.json({ error: "ID d'énigme invalide (doit être entre 1 et 7)" }, { status: 400 })
    }

    const columnName = `m${enigmeId}`

    // Mettre à jour la colonne correspondante à TRUE
    const [result] = await pool.query<ResultSetHeader>(`UPDATE workshop_partie SET ${columnName} = TRUE WHERE id = ?`, [
      partieId,
    ])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Partie non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Énigme ${enigmeId} validée avec succès`,
    })
  } catch (error) {
    console.error("Erreur lors de la validation de l'énigme:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la validation de l'énigme" }, { status: 500 })
  }
}


