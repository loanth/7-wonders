import { NextResponse, type NextRequest } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

// GET /api/partie/public
// Liste les parties publiques non terminées, triées par date de création décroissante
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = Math.max(1, Math.min(Number(limitParam) || 20, 100));

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT 
            p.id,
            p.m1, p.m2, p.m3, p.m4, p.m5, p.m6, p.m7,
            p.public,
            p.created_at,
            COUNT(up.user_id) AS players
         FROM partie p
         LEFT JOIN user_partie up ON up.partie_id = p.id
         WHERE p.public = 1
           AND NOT (p.m1 = 1 AND p.m2 = 1 AND p.m3 = 1 AND p.m4 = 1 AND p.m5 = 1 AND p.m6 = 1 AND p.m7 = 1)
           AND p.created_at BETWEEN (NOW() - INTERVAL 45 MINUTE) AND NOW()
         GROUP BY p.id
         ORDER BY p.created_at DESC
         LIMIT ?`,
        [limit]
      );

      const parties = rows.map((r) => {
        const solved = [r.m1, r.m2, r.m3, r.m4, r.m5, r.m6, r.m7].reduce(
          (acc: number, v: any) => acc + (v ? 1 : 0),
          0
        );
        const progress = Math.round((solved / 7) * 100);

        // Calcul du timer restant en secondes
        const createdAt = new Date(r.created_at).getTime();
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - createdAt) / 1000);
        const timeLeft = Math.max(0, 45 * 60 - elapsedSeconds); // 45min - elapsed

        return {
          id: r.id as number,
          players: Number(r.players || 0),
          created_at: r.created_at,
          progress,
          timeLeft, // <- le front utilisera cette valeur pour initialiser le timer
        };
      });

      return NextResponse.json({ parties });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Erreur lors de la liste des parties publiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
