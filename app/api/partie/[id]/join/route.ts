import { NextResponse, type NextRequest } from "next/server"
import pool from "@/lib/db" // ta connexion PostgreSQL (pg.Pool)

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

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Vérifier l'état de la partie
      const partieRes = await client.query(
        `SELECT public, m1, m2, m3, m4, m5, m6, m7 
         FROM workshop_partie 
         WHERE id = $1`,
        [partieId]
      )

      if (partieRes.rows.length === 0) {
        await client.query("ROLLBACK")
        return NextResponse.json({ error: "Partie non trouvée" }, { status: 404 })
      }

      const partie = partieRes.rows[0]
      const finished = [partie.m1, partie.m2, partie.m3, partie.m4, partie.m5, partie.m6, partie.m7].every((v) => !!v)

      if (!partie.public) {
        await client.query("ROLLBACK")
        return NextResponse.json({ error: "Cette partie n'est pas publique" }, { status: 400 })
      }

      if (finished) {
        await client.query("ROLLBACK")
        return NextResponse.json({ error: "Cette partie est déjà terminée" }, { status: 400 })
      }

      // Trouver ou créer l'utilisateur
      let userId: number
      const userRes = await client.query(`SELECT id FROM workshop_user WHERE pseudo = $1`, [pseudo])

      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id
      } else {
        const insertUser = await client.query(
          `INSERT INTO workshop_user (pseudo) VALUES ($1) RETURNING id`,
          [pseudo]
        )
        userId = insertUser.rows[0].id
      }

      // Lier l'utilisateur à la partie (idempotent)
      // => nécessite une contrainte unique (user_id, partie_id)
      await client.query(
        `INSERT INTO workshop_user_partie (user_id, partie_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, partie_id)
         DO UPDATE SET partie_id = EXCLUDED.partie_id`,
        [userId, partieId]
      )

      await client.query("COMMIT")

      return NextResponse.json({ success: true, userId, partieId })
    } catch (e) {
      await client.query("ROLLBACK")
      console.error("Erreur lors de la jointure à la partie:", e)
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Payload invalide ou erreur serveur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
