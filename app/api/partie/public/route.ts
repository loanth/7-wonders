import { NextResponse, type NextRequest } from "next/server"
import pool from "@/lib/db" // connexion PostgreSQL (pg.Pool)

// GET /api/partie/public
// Liste les parties publiques non terminées, triées par date de création décroissante
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const limit = Math.max(1, Math.min(Number(limitParam) || 20, 100))

    const client = await pool.connect()
    try {
      const result = await client.query(
        `
        SELECT 
          p.id,
          p.m1, p.m2, p.m3, p.m4, p.m5, p.m6, p.m7,
          p.public,
          p.created_at,
          COUNT(up.user_id) AS players
        FROM workshop_partie p
        LEFT JOIN workshop_user_partie up ON up.partie_id = p.id
        WHERE p.public = TRUE
          AND NOT (p.m1 AND p.m2 AND p.m3 AND p.m4 AND p.m5 AND p.m6 AND p.m7)
          AND p.created_at BETWEEN (NOW() - INTERVAL '45 minutes') AND NOW()
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT $1
        `,
        [limit]
      )

      const parties = result.rows.map((r) => {
        const solved = [r.m1, r.m2, r.m3, r.m4, r.m5, r.m6, r.m7].reduce(
          (acc: number, v: any) => acc + (v ? 1 : 0),
          0
        )
        const progress = Math.round((solved / 7) * 100)

        // Calcul du timer restant en secondes
        const createdAt = new Date(r.created_at).getTime()
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - createdAt) / 1000)
        const timeLeft = Math.max(0, 45 * 60 - elapsedSeconds)

        return {
          id: Number(r.id),
          players: Number(r.players || 0),
          created_at: r.created_at,
          progress,
          timeLeft,
        }
      })

      return NextResponse.json({ parties })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Erreur lors de la liste des parties publiques :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
