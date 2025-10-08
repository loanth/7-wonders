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

  const [showCongrats, setShowCongrats] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState("")
  const [quizCompleted, setQuizCompleted] = useState(false)

  const correctA = 36

  const dialogues = [
    "Namasté ! Bienvenue devant le majestueux Taj Mahal.",
    "Ce monument est un symbole d'amour éternel et de l'architecture indienne.",
    "Il a été construit au XVIIe siècle par l'empereur Shah Jahan pour sa femme Mumtaz Mahal.",
    "Ses marbres blancs et ses jardins sont célèbres dans le monde entier.",
    "Avant de résoudre l'énigme, observe bien les symboles : chacun représente un nombre secret.",
    "À toi de deviner le nombre A à partir des indices que je vais te laisser."
  ]

  const quizQuestions = [
    {
      question: "Le Taj Mahal a été construit pour :",
      options: [
        "Célébrer une victoire militaire",
        "Servir de palais impérial",
        "Honorer la mémoire d’une épouse défunte",
        "Accueillir des réunions religieuses"
      ],
      answer: 2
    },
    {
      question: "Dans quelle ville se trouve le Taj Mahal ?",
      options: ["Jaipur", "New Delhi", "Agra", "Mumbai"],
      answer: 2
    },
    {
      question: "Quelle pierre précieuse est utilisée dans la décoration du Taj Mahal ?",
      options: [
        "Le diamant",
        "Le marbre blanc incrusté de pierres semi-précieuses",
        "Le granit noir",
        "Le jade vert"
      ],
      answer: 1
    },
    {
      question: "En Inde, la vache est considérée comme :",
      options: ["Un animal sacré", "Un animal de compagnie", "Un animal nuisible", "Une légende"],
      answer: 0
    },
    {
      question: "En quelle année la construction du Taj Mahal a-t-elle commencé ?",
      options: ["1550", "1632", "1700", "1805"],
      answer: 1
    }
  ]

  useEffect(() => {
    const partieId = localStorage.getItem("partieId")
    if (!partieId) router.push("/")
    else checkEnigmeStatus(partieId)
  }, [router])

  const checkEnigmeStatus = async (partieId: string) => {
    try {
      const response = await fetch(`/api/partie/${partieId}`)
      const data = await response.json()
      if (response.ok) setIsCompleted(data.m3)
    } catch (error) { console.error(error) }
  }

  const handleNextDialogue = () => {
    if (dialogueIndex < dialogues.length - 1) setDialogueIndex(dialogueIndex + 1)
    else setShowDialogue(false)
  }

  const handleCheckAnswer = () => {
    if (parseInt(userAnswer) === correctA) {
      setFeedback("✅ Bonne réponse !")
      setShowCongrats(true)
    } else setFeedback("❌ Mauvaise réponse, essayez encore !")
  }

  const handleQuizAnswer = (index: number) => {
    if (index === quizQuestions[quizQuestionIndex].answer) {
      if (quizQuestionIndex < quizQuestions.length - 1) {
        setQuizQuestionIndex(quizQuestionIndex + 1)
        setQuizFeedback("")
      } else setQuizCompleted(true)
    } else setQuizFeedback("❌ Mauvaise réponse ! Essaie encore.")
  }

  const handleValidate = async () => {
    if (!quizCompleted) {
      alert("Vous devez d'abord compléter correctement le quizz.")
      return
    }
    const partieId = localStorage.getItem("partieId")
    if (!partieId) { router.push("/"); return }
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
    } catch (error) { console.error(error) }
    finally { setLoading(false) }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <Image
        src="/ImageEnigme3/Taj-mahal-fond.png"
        alt="Fond Inde"
        fill
        className="object-cover brightness-75 -z-10"
        priority
      />

      <div className="absolute top-4 left-4 z-30">
        <Button variant="ghost" className="text-white hover:text-purple-200" onClick={() => router.push("/accueil")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux énigmes
        </Button>
      </div>

      {/* 👳‍♂️ Dialogue initial du guide indien */}
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
          <div className="bg-black/70 p-4 rounded-xl max-w-md text-sm md:text-base">
            {dialogues[dialogueIndex]}
            {dialogueIndex < dialogues.length - 1 && (
              <p className="text-purple-300 text-xs mt-2 italic">(Cliquez pour continuer...)</p>
            )}
          </div>
        </div>
      )}

      {/* Énigme */}
      {!showDialogue && !showCongrats && !showQuiz && (
        <div className="relative z-20 flex justify-center items-center min-h-screen px-4 md:px-8">
          <Card className="bg-white/80 backdrop-blur-md text-gray-800 shadow-2xl max-w-3xl w-full border border-purple-200">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Énigme 3</CardTitle>
              <CardDescription className="text-center">
                {isCompleted ? "Vous avez déjà résolu cette énigme !" : "Résolvez cette énigme pour continuer"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="space-y-4 text-center">
                <Input type="number" placeholder="Votre réponse..." value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} disabled={isCompleted} className="text-center" />
                <Button variant="outline" onClick={handleCheckAnswer} disabled={isCompleted}>Vérifier ma réponse</Button>
                {feedback && <p className={`text-center text-lg ${feedback.includes("✅") ? "text-green-600" : "text-red-600"}`}>{feedback}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Félicitations après énigme */}
      {showCongrats && !showQuiz && !quizCompleted && (
        <div className="relative z-20 flex justify-center items-center min-h-screen px-4 md:px-8">
          <Card className="bg-white/90 text-gray-800 shadow-2xl max-w-3xl w-full border border-purple-200">
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Image src="/ImageEnigme3/image-indien.png" alt="Guide indien" width={120} height={120} className="rounded-full border-4 border-yellow-400 shadow-2xl" />
                <div className="bg-purple-800/70 p-4 rounded-xl text-white text-base">
                  Félicitations ! Tu as trouvé A.<br />
                  Mais il reste un petit quizz à compléter avant de valider l’énigme.
                </div>
              </div>
              <Button className="w-full mt-4 py-4" onClick={() => setShowQuiz(true)}>Commencer le quizz</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quizz */}
      {showQuiz && !quizCompleted && (
        <div className="relative z-20 flex justify-center items-center min-h-screen px-4 md:px-8">
          <Card className="bg-white/90 text-gray-800 shadow-2xl max-w-3xl w-full border border-purple-200">
            <CardContent className="space-y-6">
              <div className="bg-purple-800/70 p-4 rounded-xl text-white text-base">
                <p>{quizQuestions[quizQuestionIndex].question}</p>
                <div className="flex flex-col mt-2 gap-2">
                  {quizQuestions[quizQuestionIndex].options.map((opt, i) => (
                    <Button key={i} variant="outline" onClick={() => handleQuizAnswer(i)}>{opt}</Button>
                  ))}
                </div>
                {quizFeedback && <p className="mt-2 text-red-600">{quizFeedback}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Félicitations finale + validation */}
      {quizCompleted && (
        <div className="relative z-20 flex justify-center items-center min-h-screen px-4 md:px-8">
          <Card className="bg-white/90 text-gray-800 shadow-2xl max-w-3xl w-full border border-purple-200">
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Image src="/ImageEnigme3/image-indien.png" alt="Guide indien" width={120} height={120} className="rounded-full border-4 border-yellow-400 shadow-2xl" />
                <div className="bg-purple-800/70 p-4 rounded-xl text-white text-base">
                  Félicitations ! Tu as terminé le quizz.<br />
                  Tu peux maintenant valider l’énigme.
                </div>
              </div>
              <Button onClick={handleValidate} disabled={loading} className="w-full mt-4 py-4">
                {loading ? "Validation..." : "Valider l’énigme"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
