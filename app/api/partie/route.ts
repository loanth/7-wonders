import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import type { ResultSetHeader, RowDataPacket } from "mysql2"

// ✅ ROUTE POST – création d’une partie
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
      const [existingUsers] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM user WHERE pseudo = ?",
        [pseudo]
      )

      let userId: number

      if (existingUsers.length > 0) {
        userId = existingUsers[0].id
      } else {
        // Créer un nouvel utilisateur
        const [userResult] = await connection.query<ResultSetHeader>(
          "INSERT INTO user (pseudo) VALUES (?)",
          [pseudo]
        )
        userId = userResult.insertId
      }

      // Créer une nouvelle partie
      const [partieResult] = await connection.query<ResultSetHeader>(
        "INSERT INTO partie (public) VALUES (?)",
        [isPublic ? 1 : 0]
      )
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

// ✅ ROUTE GET – récupération d'une partie existante liée à un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId manquant" }, { status: 400 })
    }

    const connection = await pool.getConnection()

    try {
      // Trouver la partie associée à cet utilisateur
      const [userPartie] = await connection.query<RowDataPacket[]>(
        "SELECT partie_id FROM user_partie WHERE user_id = ? LIMIT 1",
        [userId]
      )

      if (userPartie.length === 0) {
        return NextResponse.json({ error: "Aucune partie trouvée pour cet utilisateur" }, { status: 404 })
      }

      const partieId = userPartie[0].partie_id

      // Récupérer les infos de la table partie
      const [partieRows] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM partie WHERE id = ?",
        [partieId]
      )

      if (partieRows.length === 0) {
        return NextResponse.json({ error: "Partie introuvable" }, { status: 404 })
      }

      const partie = partieRows[0]

      return NextResponse.json({ partie })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la partie:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
