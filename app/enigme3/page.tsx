"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useTimer } from "@/context/TimerContext"

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
   const { timeLeft, formatTime } = useTimer()
    const [lives, setLives] = useState(3) // 💜 Ajout des vies

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

  const correctA = 36

  const handleCheckAnswer = () => {
    if (parseInt(userAnswer) === correctA) {
      setQuizFeedback("")
      setFeedback("✅ Bonne réponse !✅")
      setShowQuizIntro(true)
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
        setTimeout(() => {
          setQuizFeedback("")
          setQuizCompleted(true)
          setEnigmeDone(true)
        }, 500)
      }
    } else {
      setQuizFeedback("❌ Mauvaise réponse !❌")
       setLives(prev => {
        const nextLives = prev - 1
        if (nextLives <= 0){
          alert("Tu as perdu toutes tes vies ! Retour à l'accueil...")
           router.push("/accueil")}
        return nextLives
      })
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

      {/* 👳‍♂️ Dialogue */}
      {showDialogue && (
        <div
          className="absolute bottom-6 left-6 flex items-end space-x-4 cursor-pointer z-40"
          onClick={handleNextDialogue}
        >
          {/* Timer */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} ❤️ {lives}
            </div>
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
          {/* Timer */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} ❤️ {lives}
            </div>
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

      {/* 👳‍♂️ Intro quiz */}
      {showQuizIntro && (
        <div className="absolute bottom-6 left-6 flex items-end space-x-4 z-40">
          {/* Timer */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} ❤️ {lives}
            </div>
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
          {/* Timer */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} ❤️ {lives}
            </div>
          <Card className="bg-white/90 text-gray-800 shadow-2xl max-w-3xl w-full border border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Question {currentQuestion + 1} / {quizQuestions.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-center font-semibold">
                {quizQuestions[currentQuestion].question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {quizQuestions[currentQuestion].options.map((opt, i) => (
                  <Button key={i} onClick={() => handleQuizAnswer(i)}>
                    {opt}
                  </Button>
                ))}
              </div>
              {quizFeedback && (
                <p
                  className={`text-center text-lg ${
                    quizFeedback.includes("✅") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quizFeedback}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🎉 Quiz terminé + Localisation + Vidéo */}
      {quizCompleted && (
        <div className="relative z-20 flex flex-col justify-center items-center min-h-screen px-4 md:px-8 text-center gap-8">
          {/* Timer */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} 
            </div>
          <p className="text-2xl font-bold text-yellow-400">
            🎉 Félicitations ! Vous avez terminé le quiz ! 🎉
          </p>
         <p className="text-2xl font-bold text-yellow-400">
            La lettre obtenue est : <span className="text-red-600">E</span>
          </p>
          {/* 📍 Localisation */}
          <div className="w-full max-w-3xl">
            <p className="text-lg font-semibold mb-2">📍 Localisation du Taj Mahal :</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.013977070454!2d78.03995327451403!3d27.175144776511516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974715f53ab7c8f%3A0xa313c3e88dc3e35a!2sTaj%20Mahal!5e0!3m2!1sfr!2sfr!4v1733769266117!5m2!1sfr!2sfr"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl shadow-lg"
            ></iframe>
          </div>

          {/* 🎥 Vidéo */}
          <div className="w-full max-w-3xl">
            <p className="text-lg font-semibold mb-2">🎥 Découvrez le Taj Mahal en vidéo :</p>
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/xF9xhuldEjA?si=R--Nun9dQdzA0w1G"
                title="Taj Mahal - Inde"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* ✅ Bouton Validation */}
          <Button onClick={handleValidate} disabled={loading} size="lg" className="mt-6">
            {loading ? "Validation..." : "Valider l’énigme"}
          </Button>
        </div>
      )}
    </div>
  )
}
