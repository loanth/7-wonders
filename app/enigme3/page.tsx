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
  const [showQuizIntro, setShowQuizIntro] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState("")
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [enigmeDone, setEnigmeDone] = useState(false)

  // 💬 Dialogues du guide indien pour l'histoire
  const dialogues = [
    "Namasté ! Bienvenue devant le majestueux Taj Mahal.",
    "Ce monument est un symbole d'amour éternel et de l'architecture indienne.",
    "Il a été construit au XVIIe siècle par l'empereur Shah Jahan pour sa femme Mumtaz Mahal.",
    "Ses marbres blancs et ses jardins sont célèbres dans le monde entier.",
    "Avant de résoudre l'énigme, observe bien les symboles : chacun représente un nombre secret.",
    "À toi de deviner le nombre A à partir des indices que je vais te laisser."
  ]

  // Quiz
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

  const correctA = 36 // X+Y=7, X*Y=10 => X²+Y²=29=Z, Z+X+Y=36

  // useEffect(() => {
  //   const partieId = localStorage.getItem("partieId")
  //   if (!partieId) {
  //     router.push("/")
  //     return
  //   }

  //   checkEnigmeStatus(partieId)
  // }, [router])

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
      setQuizFeedback("")
      setFeedback("✅ Bonne réponse !✅")
      setShowQuizIntro(true) // Lancer intro quiz
    } else {
      setFeedback("❌ Mauvaise réponse, essayez encore !❌")
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
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 3 })
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

  const handleQuizAnswer = (index: number) => {
    const q = quizQuestions[currentQuestion]
    if (index === q.answer) {
      setQuizFeedback("✅ Bonne réponse ! ✅")
      if (currentQuestion + 1 < quizQuestions.length) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
          setQuizFeedback("")
        }, 500)
      } else {
        // Quiz terminé
        setTimeout(() => {
          setQuizFeedback("")
          setQuizCompleted(true)
          setEnigmeDone(true) // bloque l'affichage de l'énigme
        }, 500)
      }
    } else {
      setQuizFeedback("❌ Mauvaise réponse !❌")
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

      {/* 👳‍♂️ Dialogue indien */}
      {showDialogue && (
        <div
          className="absolute bottom-6 left-6 flex items-end space-x-4 cursor-pointer z-40"
          onClick={handleNextDialogue}
        >
          <Image
            src="/ImageEnigme3/image-indien.png"
            alt="Guide indien"
            width={300}
            height={300}
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

      {/* 🧩 Enigme */}
      {!showDialogue && !showQuizIntro && !showQuiz && !enigmeDone && (
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
              {/* 🔢 Calcul avec images */}
              <div className="bg-slate-50 p-6 rounded-lg text-gray-800 text-center">
                <p className="mb-4 text-lg font-semibold text-purple-700">
                  Les symboles de la sagesse :
                </p>

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
                <Button variant="outline" onClick={handleCheckAnswer} disabled={isCompleted}>
                  Vérifier ma réponse
                </Button>
                {feedback && (
                  <p
                    className={`text-center text-lg ${
                      feedback.includes("✅") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {feedback}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 👳‍♂️ Intro quiz après réussite énigme */}
      {showQuizIntro && (
        <div className="absolute bottom-6 left-6 flex items-end space-x-4 z-40">
          <Image
            src="/ImageEnigme3/image-indien.png"
            alt="Guide indien"
            width={250}
            height={250}
            className="rounded-full border-4 border-yellow-400 shadow-2xl"
          />
          <div className="bg-black/70 p-4 rounded-xl max-w-md text-sm md:text-base">
            <p>🎉 Bravo pour avoir résolu l'énigme !🎉</p>
            <p>Il reste maintenant un petit quiz de culture générale sur l'Inde et le Taj Mahal.</p>
            <Button
              className="mt-2"
              onClick={() => {
                setShowQuizIntro(false)
                setShowQuiz(true)
              }}
            >
              Commencer le quiz
            </Button>
          </div>
        </div>
      )}

      {/* 📝 Quiz */}
      {showQuiz && !quizCompleted && (
        <div className="relative z-20 flex justify-center items-center min-h-screen px-4 md:px-8">
          <Card className="bg-white/90 text-gray-800 shadow-2xl max-w-3xl w-full border border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Question {currentQuestion + 1} / {quizQuestions.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-center font-semibold">{quizQuestions[currentQuestion].question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {quizQuestions[currentQuestion].options.map((opt, i) => (
                  <Button key={i} onClick={() => handleQuizAnswer(i)}>
                    {opt}
                  </Button>
                ))}
              </div>
              {quizFeedback && (
                <p className={`text-center text-lg ${quizFeedback.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                  {quizFeedback}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🎉 Quiz terminé, bouton validation */}
      {quizCompleted && (
        <div className="relative z-20 flex flex-col justify-center items-center min-h-screen px-4 md:px-8 text-center gap-4">
          <p className="text-2xl font-bold text-yellow-400">🎉 Félicitations ! Vous avez terminé le quiz !🎉</p>
          <Button onClick={handleValidate} disabled={loading} size="lg">
            {loading ? "Validation..." : "Valider l’énigme"}
          </Button>
        </div>
      )}
    </div>
  )
}
