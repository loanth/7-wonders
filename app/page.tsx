"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [pseudo, setPseudo] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreatePartie = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pseudo.trim()) {
      alert("Veuillez entrer un pseudo")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/partie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudo: pseudo.trim(),
          public: isPublic,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Stocker l'ID de la partie et l'ID utilisateur dans le localStorage
        localStorage.setItem("partieId", data.partieId)
        localStorage.setItem("userId", data.userId)
        localStorage.setItem("pseudo", pseudo.trim())

        // Rediriger vers la page d'accueil avec les énigmes
        router.push("/accueil")
      } else {
        alert(data.error || "Erreur lors de la création de la partie")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Jeu d'Énigmes</CardTitle>
          <CardDescription>Créez votre partie et résolvez les 7 énigmes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePartie} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pseudo">Pseudo</Label>
              <Input
                id="pseudo"
                type="text"
                placeholder="Entrez votre pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required
                maxLength={255}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="public" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked as boolean)} />
              <Label
                htmlFor="public"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Autoriser le multijoueur
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création..." : "Créer la partie"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
