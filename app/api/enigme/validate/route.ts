import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db" // ton fichier PostgreSQL (pg.Pool)

export async function POST(request: NextRequest) {
  try {
    const { partieId, enigmeId } = await request.json()

    if (!partieId || !enigmeId) {
      return NextResponse.json(
        { error: "ID de partie et ID d'énigme requis" },
        { status: 400 }
      )
    }

    // Vérifie que l'énigme est bien entre 1 et 7
    if (enigmeId < 1 || enigmeId > 7) {
      return NextResponse.json(
        { error: "ID d'énigme invalide (doit être entre 1 et 7)" },
        { status: 400 }
      )
    }

    const columnName = `m${enigmeId}`

    // ⚠️ On insère le nom de la colonne dynamiquement avec interpolation,
    // mais on garde les valeurs sécurisées avec des paramètres ($1, $2)
    const query = `UPDATE workshop_partie SET ${columnName} = TRUE WHERE id = $1`
    const result = await pool.query(query, [partieId])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Partie non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Énigme ${enigmeId} validée avec succès`,
    })
  } catch (error: any) {
    console.error("Erreur lors de la validation de l'énigme :", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la validation de l'énigme" },
      { status: 500 }
    )
  }
}
