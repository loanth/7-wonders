import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { ResultSetHeader, RowDataPacket } from "mysql2"

export async function POST(request: NextRequest) {
  try {
    const { pseudo, public: isPublic } = await request.json()

    if (!pseudo || typeof pseudo !== "string") {
      return NextResponse.json({ error: "Pseudo requis" }, { status: 400 })
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Vérifier si l'utilisateur existe déjà
      const [existingUsers] = await connection.query<RowDataPacket[]>("SELECT id FROM user WHERE pseudo = ?", [pseudo])

      let userId: number

      if (existingUsers.length > 0) {
        userId = existingUsers[0].id
      } else {
        // Créer un nouvel utilisateur
        const [userResult] = await connection.query<ResultSetHeader>("INSERT INTO user (pseudo) VALUES (?)", [pseudo])
        userId = userResult.insertId
      }

      // Créer une nouvelle partie
      const [partieResult] = await connection.query<ResultSetHeader>("INSERT INTO partie (public) VALUES (?)", [
        isPublic ? 1 : 0,
      ])
      const partieId = partieResult.insertId

      // Lier l'utilisateur à la partie
      await connection.query("INSERT INTO user_partie (user_id, partie_id) VALUES (?, ?)", [userId, partieId])

      await connection.commit()

      return NextResponse.json({
        success: true,
        userId,
        partieId,
        message: "Partie créée avec succès",
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Erreur lors de la création de la partie:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la création de la partie" }, { status: 500 })
  }
}
