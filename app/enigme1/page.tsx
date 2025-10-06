"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Enigme1Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const partieId = localStorage.getItem("partieId")
    if (!partieId) {
      router.push("/")
      return
    }

    checkEnigmeStatus(partieId)
  }, [router])

  const checkEnigmeStatus = async (partieId: string) => {
    try {
      const response = await fetch(`/api/partie/${partieId}`)
      const data = await response.json()

      if (response.ok) {
        setIsCompleted(data.m1)
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleValidate = async () => {
    const partieId = localStorage.getItem("partieId")

    if (!partieId) {
      router.push("/")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/enigme/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partieId: Number.parseInt(partieId),
          enigmeId: 1,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/accueil")
      } else {
        alert(data.error || "Erreur lors de la validation")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-purple-200"
          onClick={() => router.push("/accueil")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux énigmes
        </Button>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl">Énigme 1</CardTitle>
            <CardDescription>
              {isCompleted ? "Vous avez déjà résolu cette énigme !" : "Résolvez cette énigme pour continuer"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-8 rounded-lg min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500 text-center">Le contenu de l'énigme 1 sera ajouté ici</p>
            </div>

            <Button
              onClick={handleValidate}
              disabled={loading || isCompleted}
              className="w-full text-lg py-6"
              size="lg"
            >
              {loading ? "Validation..." : isCompleted ? "Déjà validée ✓" : "Valider"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
