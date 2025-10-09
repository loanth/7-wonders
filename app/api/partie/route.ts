import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db" // ton fichier de connexion PostgreSQL

// POST – création d’une partie
export async function POST(request: NextRequest) {
  try {
    const { pseudo, public: isPublic } = await request.json()

    if (!pseudo || typeof pseudo !== "string") {
      return NextResponse.json({ error: "Pseudo requis" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Vérifier si l'utilisateur existe déjà
      const userRes = await client.query(
        "SELECT id FROM workshop_user WHERE pseudo = $1",
        [pseudo]
      )

      let userId: number

      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id
      } else {
        // Créer un nouvel utilisateur
        const insertUser = await client.query(
          "INSERT INTO workshop_user (pseudo) VALUES ($1) RETURNING id",
          [pseudo]
        )
        userId = insertUser.rows[0].id
      }

      // Créer une nouvelle partie
      const insertPartie = await client.query(
        "INSERT INTO workshop_partie (public) VALUES ($1) RETURNING id",
        [isPublic ? true : false]
      )
      const partieId = insertPartie.rows[0].id

      // Lier l'utilisateur à la partie
      await client.query(
        "INSERT INTO workshop_user_partie (user_id, partie_id) VALUES ($1, $2)",
        [userId, partieId]
      )

      await client.query("COMMIT")

      return NextResponse.json({
        success: true,
        userId,
        partieId,
        message: "Partie créée avec succès",
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Erreur lors de la création de la partie :", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de la partie" },
      { status: 500 }
    )
  }
}

// GET – récupération d'une partie existante liée à un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId manquant" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      // Trouver la partie associée à cet utilisateur
      const userPartieRes = await client.query(
        "SELECT partie_id FROM workshop_user_partie WHERE user_id = $1 LIMIT 1",
        [userId]
      )

      if (userPartieRes.rows.length === 0) {
        return NextResponse.json({ error: "Aucune partie trouvée pour cet utilisateur" }, { status: 404 })
      }

      const partieId = userPartieRes.rows[0].partie_id

      // Récupérer les infos de la table partie
      const partieRes = await client.query(
        "SELECT * FROM workshop_partie WHERE id = $1",
        [partieId]
      )

      if (partieRes.rows.length === 0) {
        return NextResponse.json({ error: "Partie introuvable" }, { status: 404 })
      }

      return NextResponse.json({ partie: partieRes.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la partie :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
