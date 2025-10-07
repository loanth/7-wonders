"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Enigme1Page() {
  const router = useRouter()
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [isDialogueFinished, setIsDialogueFinished] = useState(false)
  const [answer, setAnswer] = useState("")
  const [showCongrats, setShowCongrats] = useState(false)
  const [loading, setLoading] = useState(false)

  // 💬 Textes de dialogue
  const dialogues = [
    "Ah, te voilà enfin...",
    "Je suis le gardien de cette épreuve. Peu ont réussi à me vaincre.",
    "Regarde bien ce message chiffré. César en personne l’a codé pour protéger un secret.",
    "Trouve la clé, déchiffre le texte, et tu connaîtras la lettre cachée...",
  ]

  // 🧩 Code César
  const encryptedText = "F qbtf'f bqqmft! Kl jvkl dvyk?" // décalage 17
  const correctAnswer = "JE RESTE CALME"

  useEffect(() => {
    const handleNext = (e: KeyboardEvent | MouseEvent) => {
      if (isDialogueFinished) return
      if ((e as KeyboardEvent).code === "Space" || (e as MouseEvent).type === "click") {
        setDialogueIndex((prev) => {
          if (prev < dialogues.length - 1) return prev + 1
          else {
            setIsDialogueFinished(true)
            return prev
          }
        })
      }
    }

    window.addEventListener("keydown", handleNext)
    window.addEventListener("click", handleNext)

    return () => {
      window.removeEventListener("keydown", handleNext)
      window.removeEventListener("click", handleNext)
    }
  }, [isDialogueFinished, dialogues.length])

  const handleValidate = async () => {
    if (answer.trim().toUpperCase() !== correctAnswer) {
      alert("Ce n’est pas la bonne réponse…")
      return
    }

    setShowCongrats(true)
    const partieId = localStorage.getItem("partieId")
    if (!partieId) return

    setLoading(true)
    try {
      await fetch("/api/enigme/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 1 }),
      })
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  if (showCongrats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-800 to-slate-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">🎉 Félicitations ! 🎉</h1>
        <p className="text-xl mb-6">
          Tu as percé le mystère du code de César... et découvert la lettre{" "}
          <span className="text-yellow-300 font-bold text-2xl">U</span>.
        </p>
        <Button onClick={() => router.push("/accueil")} size="lg">
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center flex items-end justify-center text-white"
      style={{
        backgroundImage: "url('https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/7/0/5/705121344c_110004_colisee-rome.jpg')", // 🔧 ton fond ici
      }}
    >
      {/* Dialogue */}
      {!isDialogueFinished ? (
        <div className="absolute bottom-8 w-[90%] max-w-4xl bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-lg leading-relaxed text-center">
          {dialogues[dialogueIndex]}
          <p className="text-sm text-gray-300 mt-2">(Appuie sur espace ou clique pour continuer...)</p>
        </div>
      ) : (
        // 🧩 Énigme
        <div className="absolute bottom-12 w-[90%] max-w-3xl bg-black/60 backdrop-blur-md rounded-xl p-6 border border-purple-400/30 text-center space-y-4">
          <p className="text-lg mb-2">
            Message chiffré :
            <br />
            <span className="font-mono text-2xl text-yellow-300">{encryptedText}</span>
          </p>
          <p className="text-sm text-gray-300 italic">Indice : César n’aimait pas le chiffre dix.</p>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ta réponse ici"
            className="p-3 rounded-md text-black w-full max-w-md text-center"
          />

          <Button
            onClick={handleValidate}
            disabled={loading}
            className="w-full max-w-md text-lg py-6 bg-purple-700 hover:bg-purple-600"
          >
            {loading ? "Validation..." : "Valider la réponse"}
          </Button>
        </div>
      )}

      {/* 👤 Personnage */}
      <img
        src="/img/pngtree-cartoon-character-of-greek-ancient-warrior-holding-spear-and-shield-png-image_11960426-removebg-preview.png"
        alt="Personnage"
        className="absolute bottom-0 right-0 w-[500px] md:w-[500px] select-none pointer-events-none"
      />
    </div>
  )
}
