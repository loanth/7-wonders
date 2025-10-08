import { NextResponse, type NextRequest } from "next/server"
import pool from "@/lib/db"
import type { ResultSetHeader, RowDataPacket } from "mysql2"

// POST /api/partie/[id]/join
// Permet à un utilisateur (pseudo) de rejoindre une partie publique non terminée
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const partieId = Number(params.id)
  if (!partieId || Number.isNaN(partieId)) {
    return NextResponse.json({ error: "ID de partie invalide" }, { status: 400 })
  }

  try {
    const { pseudo } = await request.json()
    if (!pseudo || typeof pseudo !== "string" || !pseudo.trim()) {
      return NextResponse.json({ error: "Pseudo requis" }, { status: 400 })
    }

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      // Vérifier l'état de la partie
      const [partieRows] = await connection.query<RowDataPacket[]>(
        "SELECT public, m1, m2, m3, m4, m5, m6, m7 FROM partie WHERE id = ?",
        [partieId]
      )
      if (partieRows.length === 0) {
        await connection.rollback()
        return NextResponse.json({ error: "Partie non trouvée" }, { status: 404 })
      }
      const partie = partieRows[0]
      const finished = [partie.m1, partie.m2, partie.m3, partie.m4, partie.m5, partie.m6, partie.m7].every((v: any) => !!v)
      if (!partie.public) {
        await connection.rollback()
        return NextResponse.json({ error: "Cette partie n'est pas publique" }, { status: 400 })
      }
      if (finished) {
        await connection.rollback()
        return NextResponse.json({ error: "Cette partie est déjà terminée" }, { status: 400 })
      }

      // Trouver ou créer l'utilisateur
      let userId: number
      const [users] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM user WHERE pseudo = ?",
        [pseudo]
      )
      if (users.length > 0) {
        userId = users[0].id
      } else {
        const [userRes] = await connection.query<ResultSetHeader>(
          "INSERT INTO user (pseudo) VALUES (?)",
          [pseudo]
        )
        userId = userRes.insertId
      }

      // Lier l'utilisateur à la partie (idempotent)
      await connection.query(
        "INSERT INTO user_partie (user_id, partie_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE partie_id = VALUES(partie_id)",
        [userId, partieId]
      )

      await connection.commit()
      return NextResponse.json({ success: true, userId, partieId })
    } catch (e) {
      await connection.rollback()
      console.error("Erreur lors de la jointure à la partie:", e)
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Payload invalide ou erreur serveur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

