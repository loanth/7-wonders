"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function EnigmeChichenItzaPage() {
  const router = useRouter()
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [isDialogueFinished, setIsDialogueFinished] = useState(false)
  const [answer, setAnswer] = useState("")
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [postPhase, setPostPhase] = useState(false)
  const [postDialogueIndex, setPostDialogueIndex] = useState(0)

  const dialogues = [
    "Bienvenue à Chichen Itza, voyageur du temps... Je m'appelle Pedro",
    "Ici, les Mayas observaient les étoiles pour prédire le futur et érigeaient leurs temples selon les astres.",
    "Devant toi se dresse le Temple de Kukulcán, le serpent à plumes.",
    "Pour en percer le mystère, tu devras ouvrir un cadenas à 4 chiffres...",
    "Les anciens utilisaient un système simple : quelques points... et des traits horizontaux qui valent bien plus.",
    "Observe les symboles gravés sur les pierres et trouve la combinaison cachée.",
  ]

  const correctAnswer = "4769"
  const symbols = [
    { id: 1, image: "https://i.imgur.com/TU2Bv0x.png", description: "Symbole de faible valeur" },
    { id: 2, image: "https://i.imgur.com/6S1v7xO.png", description: "Symbole de plus grande valeur" },
  ]

  const codedNumbers = [
    { maya: "••••" },
    { maya: "━ ••" },
    { maya: "━ •" },
    { maya: "━ ••••" },
  ]

  const postAnswerDialogues = [
    "Tu as trouvé la bonne combinaison !",
    "Les chiffres mayas étaient bien plus qu’un simple système de comptage : ils reflétaient leur vision cosmique.",
    "Leur calendrier sacré, le Tzolk’in, guidait les rituels et les saisons.",
    "Chichen Itza était un centre religieux et astronomique majeur.",
    "Le Temple de Kukulcán est conçu de sorte qu’à chaque équinoxe, le serpent à plumes semble descendre les marches...",
    "Une preuve du génie des Mayas et de leur lien avec les cieux.",
    "Maintenant, montre que tu as bien retenu : place au quiz !",
  ]

  const quiz = [
    {
      question: "Où se trouve Chichen Itza ?",
      options: ["Pérou", "Mexique", "Guatemala", "Brésil"],
      correct: "Mexique",
    },
    {
      question: "Quel dieu est honoré par la pyramide principale de Chichen Itza ?",
      options: ["Kukulcán", "Quetzalcoatl", "Itzamna", "Huitzilopochtli"],
      correct: "Kukulcán",
    },
    {
      question: "Combien de marches possède la pyramide de Kukulcán au total (y compris la plate-forme) ?",
      options: ["364", "365", "366", "260"],
      correct: "365",
    },
    {
      question: "À quoi servait Chichen Itza pour les Mayas ?",
      options: [
        "Un lieu de commerce uniquement",
        "Une cité religieuse et astronomique",
        "Une base militaire",
        "Un centre pour le jeu de balle uniquement",
      ],
      correct: "Une cité religieuse et astronomique",
    },
    {
      question: "Que représente le serpent visible pendant l’équinoxe ?",
      options: [
        "Le dieu Kukulcán descendant du ciel",
        "Un signe d’éclipse",
        "Une décoration sans signification",
        "Une illusion d’optique sans lien religieux",
      ],
      correct: "Le dieu Kukulcán descendant du ciel",
    },
  ]

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
    if (answer.trim() !== correctAnswer) {
      alert("Ce n’est pas la bonne combinaison… observe bien les symboles et réfléchis à leur valeur relative.")
      return
    }
    setIsDialogueFinished(false)
    setDialogueIndex(0)
    setShowQuiz(false)
    setAnswer("")
    setPostPhase(true)
  }

  useEffect(() => {
    if (!postPhase) return
    const handleNextPost = (e: KeyboardEvent | MouseEvent) => {
      if ((e as KeyboardEvent).code === "Space" || (e as MouseEvent).type === "click") {
        setPostDialogueIndex((prev) => {
          if (prev < postAnswerDialogues.length - 1) return prev + 1
          else {
            setShowQuiz(true)
            setPostPhase(false)
            return prev
          }
        })
      }
    }
    window.addEventListener("keydown", handleNextPost)
    window.addEventListener("click", handleNextPost)
    return () => {
      window.removeEventListener("keydown", handleNextPost)
      window.removeEventListener("click", handleNextPost)
    }
  }, [postPhase])

  const handleAnswerQuiz = (option: string) => {
    const current = quiz[quizIndex]
    const isCorrect = option === current.correct
    setFeedback(isCorrect ? "✅ Bonne réponse !" : "❌ Mauvaise réponse...")
    if (isCorrect) setScore((prev) => prev + 1)
    setTimeout(() => {
      setFeedback(null)
      if (quizIndex < quiz.length - 1) setQuizIndex((prev) => prev + 1)
      else finishQuiz()
    }, 1500)
  }

  const finishQuiz = async () => {
    setShowCongrats(true)
    const partieId = localStorage.getItem("partieId")
    if (!partieId) return
    setLoading(true)
    try {
      await fetch("/api/enigme/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 5 }),
      })
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  if (showCongrats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-yellow-800 to-emerald-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Félicitations !</h1>
        <p className="text-xl mb-6">
          Tu as percé le mystère de Chichen Itza et remporté le quiz maya !
          <br />
          Tu gagnes la lettre <span className="text-yellow-300 font-bold text-2xl">C</span>.
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
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/8/8d/El_Castillo_Stitch_2008_Edit_1.jpg')",
      }}
    >
      {!isDialogueFinished && !postPhase && !showQuiz && (
        <div className="absolute bottom-8 w-[90%] max-w-4xl bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-300/20 text-lg text-center">
          {dialogues[dialogueIndex]}
          <p className="text-sm text-gray-300 mt-2">(Espace ou clic pour continuer...)</p>
        </div>
      )}

      {/* Bloc de l’énigme avec indice ajouté */}
      {isDialogueFinished && !postPhase && !showQuiz && (
        <div className="absolute bottom-12 w-[90%] max-w-3xl bg-black/60 backdrop-blur-md rounded-xl p-6 border border-yellow-400/30 text-center space-y-4">
          <p className="text-lg mb-2">Entre la combinaison du cadenas :</p>
          <div className="flex justify-center gap-6 flex-wrap mb-4">
            {codedNumbers.map((num, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-lg">
                <p className="text-2xl font-mono text-yellow-300">{num.maya}</p>
              </div>
            ))}
          </div>

          {/* 🔍 Indice ajouté ici */}
          <p className="text-sm italic text-gray-300 mb-2">
            (Indice : la somme des 4 chiffres est égale à <span className="text-yellow-400 font-semibold">26</span>.)
          </p>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Entrez votre réponse"
            className="p-3 rounded-md text-black w-full max-w-md text-center"
          />

          <Button
            onClick={handleValidate}
            disabled={loading}
            className="w-full max-w-md text-lg py-6 bg-amber-700 hover:bg-amber-600"
          >
            {loading ? "Validation..." : "Valider la réponse"}
          </Button>
        </div>
      )}

      {postPhase && !showQuiz && (
        <div className="absolute bottom-8 w-[90%] max-w-4xl bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-lg leading-relaxed text-center">
          {postAnswerDialogues[postDialogueIndex]}
          <p className="text-sm text-gray-300 mt-2">(Espace ou clic pour continuer...)</p>
        </div>
      )}

      {showQuiz && !showCongrats && (
        <div className="absolute bottom-8 w-[90%] max-w-4xl bg-black/70 backdrop-blur-sm rounded-xl p-6 border border-amber-400/20 text-center space-y-4">
          <h2 className="text-2xl font-bold mb-4">{quiz[quizIndex].question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {quiz[quizIndex].options.map((option, i) => (
              <Button
                key={i}
                onClick={() => handleAnswerQuiz(option)}
                disabled={!!feedback}
                className="bg-amber-700 hover:bg-amber-600 text-lg py-4"
              >
                {option}
              </Button>
            ))}
          </div>
          {feedback && (
            <p
              className={`text-xl font-semibold mt-4 ${
                feedback.includes("Bonne") ? "text-green-400" : "text-red-400"
              }`}
            >
              {feedback}
            </p>
          )}
          <p className="text-sm text-gray-300 mt-3">
            Question {quizIndex + 1} sur {quiz.length}
          </p>
        </div>
      )}

      <img
        src="/img/pedro.png"
        alt="Personnage maya"
        className="absolute bottom-0 right-0 w-[420px] md:w-[480px] select-none pointer-events-none"
      />
    </div>
  )
}
