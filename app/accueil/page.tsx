"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"

interface PartieStatus {
  m1: boolean
  m2: boolean
  m3: boolean
  m4: boolean
  m5: boolean
  m6: boolean
  m7: boolean
}

export default function AccueilPage() {
  const [pseudo, setPseudo] = useState("")
  const [partieStatus, setPartieStatus] = useState<PartieStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedPseudo = localStorage.getItem("pseudo")
    const partieId = localStorage.getItem("partieId")

    if (!storedPseudo || !partieId) {
      router.push("/")
      return
    }

    setPseudo(storedPseudo)
    loadPartieStatus(partieId)
  }, [router])

  const loadPartieStatus = async (partieId: string) => {
    try {
      const response = await fetch(`/api/partie/${partieId}`)
      const data = await response.json()

      if (response.ok) {
        setPartieStatus(data)
      } else {
        console.error("Erreur lors du chargement de la partie")
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const enigmes = [
    { id: 1, titre: "Énigme 1", description: "La première énigme vous attend" },
    { id: 2, titre: "Énigme 2", description: "Déchiffrez le code secret" },
    { id: 3, titre: "Énigme 3", description: "Trouvez la clé cachée" },
    { id: 4, titre: "Énigme 4", description: "Résolvez le mystère" },
    { id: 5, titre: "Énigme 5", description: "Découvrez la vérité" },
    { id: 6, titre: "Énigme 6", description: "Percez le secret" },
    { id: 7, titre: "Énigme 7", description: "L'énigme finale" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    )
  }

  const completedCount = partieStatus ? Object.values(partieStatus).filter(Boolean).length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Bienvenue {pseudo} !</h1>
          <p className="text-purple-200 text-lg">Énigmes résolues : {completedCount} / 7</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enigmes.map((enigme) => {
            const isCompleted = partieStatus?.[`m${enigme.id}` as keyof PartieStatus]

            return (
              <Card
                key={enigme.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isCompleted ? "bg-green-50 border-green-500" : ""
                }`}
                onClick={() => router.push(`/enigme/${enigme.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{enigme.titre}</CardTitle>
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <CardDescription>{enigme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant={isCompleted ? "secondary" : "default"} className="w-full">
                    {isCompleted ? "Résolue ✓" : "Commencer"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {completedCount === 7 && (
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-none">
              <CardHeader>
                <CardTitle className="text-3xl text-white">🎉 Félicitations ! 🎉</CardTitle>
                <CardDescription className="text-white text-lg">Vous avez résolu toutes les énigmes !</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
