"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function Enigme3Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [showDialogue, setShowDialogue] = useState(true)

  // 💬 Dialogues du guide indien (5-6 clics)
  const dialogues = [
    "Namasté ! Bienvenue devant le majestueux Taj Mahal.",
    "Ce monument est un symbole d'amour éternel et de l'architecture indienne.",
    "Il a été construit au XVIIe siècle par l'empereur Shah Jahan pour sa femme Mumtaz Mahal.",
    "Ses marbres blancs et ses jardins sont célèbres dans le monde entier.",
    "Avant de résoudre l'énigme, observe bien les symboles : chacun représente un nombre secret.",
    "À toi de deviner le nombre A à partir des indices que je vais te laisser."
  ]

  // 💡 Valeur correcte de A
  const correctA = 36 // X+Y=7, X*Y=10 => Z=X²+Y²=29, A=Z+X+Y=36

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
      if (response.ok) setIsCompleted(data.m3)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleCheckAnswer = () => {
    if (parseInt(userAnswer) === correctA) {
      setFeedback("✅ Bonne réponse ! Vous pouvez valider l’énigme.")
    } else {
      setFeedback("❌ Mauvaise réponse, essayez encore !")
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 3 }),
      })
      const data = await response.json()
      if (response.ok) router.push("/accueil")
      else alert(data.error || "Erreur lors de la validation")
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  const handleNextDialogue = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1)
    } else {
      setShowDialogue(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* 🌄 Fond */}
      <Image
        src="/ImageEnigme3/Taj-mahal-fond.png"
        alt="Fond Inde"
        fill
        className="object-cover brightness-75 -z-10"
        priority
      />

      {/* 🔙 Retour */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          variant="ghost"
          className="text-white hover:text-purple-200"
          onClick={() => router.push("/accueil")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux énigmes
        </Button>
      </div>

      {/* 👳‍♂️ Guide indien avec dialogues */}
      {showDialogue && (
        <div
          className="absolute bottom-6 left-6 flex items-end space-x-4 cursor-pointer z-40"
          onClick={handleNextDialogue}
        >
          <Image
            src="/ImageEnigme3/image-indien.png"
            alt="Guide indien"
            width={160}
            height={160}
            className="rounded-full border-4 border-yellow-400 shadow-2xl"
          />
          <div className="bg-black/70 p-4 rounded-xl max-w-md text-sm md:text-base transition-all duration-300">
            {dialogues[dialogueIndex]}
            {dialogueIndex < dialogues.length - 1 && (
              <p className="text-purple-300 text-xs mt-2 italic">(Cliquez pour continuer...)</p>
            )}
          </div>
        </div>
      )}

      {/* 🧩 Contenu principal */}
      {!showDialogue && (
        <div className="relative z-20 flex justify-center items-center min-h-screen px-4 md:px-8">
          <Card className="bg-white/80 backdrop-blur-md text-gray-800 shadow-2xl max-w-3xl w-full border border-purple-200">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Énigme 3</CardTitle>
              <CardDescription className="text-center">
                {isCompleted
                  ? "Vous avez déjà résolu cette énigme !"
                  : "Résolvez cette énigme pour continuer"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 🔢 Calcul avec images (résultats visibles, valeurs X/Y/Z cachées) */}
              <div className="bg-slate-50 p-6 rounded-lg text-gray-800 text-center">
                <p className="mb-4 text-lg font-semibold text-purple-700">Les symboles de la sagesse :</p>

                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Image src="/ImageEnigme3/Taj-mahal.png" alt="X" width={60} height={60} />
                    <span className="text-lg font-bold">+</span>
                    <Image src="/ImageEnigme3/Vache-inde.png" alt="Y" width={60} height={60} />
                    <span className="text-lg font-bold">= 7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/ImageEnigme3/Taj-mahal.png" alt="X" width={60} height={60} />
                    <span className="text-lg font-bold">×</span>
                    <Image src="/ImageEnigme3/Vache-inde.png" alt="Y" width={60} height={60} />
                    <span className="text-lg font-bold">= 10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/ImageEnigme3/Taj-mahal.png" alt="X" width={60} height={60} />
                    <span className="text-lg font-bold">² + </span>
                    <Image src="/ImageEnigme3/Vache-inde.png" alt="Y" width={60} height={60} />
                    <span className="text-lg font-bold">² = </span>
                    <Image src="/ImageEnigme3/Yoga.png" alt="Z" width={60} height={60} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/ImageEnigme3/Yoga.png" alt="Z" width={60} height={60} />
                    <span className="text-lg font-bold">+ </span>
                    <Image src="/ImageEnigme3/Taj-mahal.png" alt="X" width={60} height={60} />
                    <span className="text-lg font-bold">+ </span>
                    <Image src="/ImageEnigme3/Vache-inde.png" alt="Y" width={60} height={60} />
                    <span className="text-lg font-bold">= A</span>
                  </div>
                </div>

                <p className="italic mt-2">Quel est le numéro de A ?</p>
              </div>

              {/* 🧮 Réponse et feedback */}
              <div className="space-y-4 text-center">
                <Input
                  type="number"
                  placeholder="Votre réponse..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isCompleted}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  onClick={handleCheckAnswer}
                  disabled={isCompleted}
                >
                  Vérifier ma réponse
                </Button>
                {feedback && (
                  <p
                    className={`text-center text-lg ${feedback.includes("✅") ? "text-green-600" : "text-red-600"}`}
                  >
                    {feedback}
                  </p>
                )}
              </div>

              {/* ✅ Validation */}
              <Button
                onClick={handleValidate}
                disabled={loading || isCompleted || !feedback.includes("✅")}
                className="w-full text-lg py-6"
                size="lg"
              >
                {loading ? "Validation..." : isCompleted ? "Déjà validée ✓" : "Valider l’énigme"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
