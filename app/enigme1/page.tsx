"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTimer } from "@/context/TimerContext"

export default function Enigme1Page() {
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
  const [showVideo, setShowVideo] = useState(false)
   const [lives, setLives] = useState(3) // 💜 Ajout des vies

  const { timeLeft, formatTime } = useTimer()
  const VIDEO_URL = "https://www.youtube.com/embed/bmvxRMYxlhE"

  const dialogues = [
    "Ah, te voilà enfin...",
    "Je suis le gardien de cette épreuve. Peu ont réussi à me vaincre.",
    "Regarde bien ce message chiffré. César en personne l’a codé pour protéger un secret.",
    "Trouve la clé, déchiffre le texte, et tu connaîtras la lettre cachée...",
  ]

  const encryptedText = "Wkhswec Nomswec Wobsnsec Mrop Noc Kbwooc Ne Xybn"
  const correctAnswer = "Maximus Decimus Meridius Chef Des Armees Du Nord"

  const postAnswerDialogues = [
    "Impressionnant... tu as trouvé la phrase cachée.",
    "Maximus Decimus Meridius... Ce nom ne t’est pas inconnu, n’est-ce pas ?",
    "C’est une référence au film Gladiator de Ridley Scott. Maximus, le général trahi devenu esclave, puis gladiateur...",
    "Dans ce film, le Colisée est bien plus qu’une arène : c’est le théâtre du destin, là où la gloire et la vengeance s’affrontent.",
    "Mais savais-tu que le vrai Colisée, lui, fut construit sous l’empereur Vespasien vers l’an 70 après J.-C. ?",
    "Il pouvait accueillir jusqu’à 50 000 spectateurs venus voir des combats, des chasses et même des batailles navales reconstituées !",
    "Chef-d'œuvre d’architecture romaine, il est resté debout pendant presque deux millénaires, symbole de puissance et de spectacle.",
    "À présent, prouve que tu mérites ton titre de gladiateur... Réponds à ces questions !",
  ]

  const quiz = [
    {
      question: "Qui est le réalisateur du film Gladiator ?",
      options: ["Steven Spielberg", "Ridley Scott", "Christopher Nolan", "James Cameron"],
      correct: "Ridley Scott",
    },
    {
      question: "Quel est le nom complet du héros de Gladiator ?",
      options: [
        "Marcus Aurelius",
        "Lucius Verus",
        "Maximus Decimus Meridius",
        "Titus Flavius Vespasianus",
      ],
      correct: "Maximus Decimus Meridius",
    },
    {
      question: "Sous quel empereur le Colisée a-t-il été construit ?",
      options: ["Néron", "Vespasien", "Trajan", "Auguste"],
      correct: "Vespasien",
    },
    {
      question: "Combien de spectateurs environ pouvaient s’asseoir dans le Colisée ?",
      options: ["10 000", "25 000", "50 000", "80 000"],
      correct: "50 000",
    },
    {
      question: "Quel était le principal usage du Colisée ?",
      options: [
        "Les courses de chars",
        "Les combats de gladiateurs",
        "Les pièces de théâtre",
        "Les cérémonies religieuses",
      ],
      correct: "Les combats de gladiateurs",
    },
    {
      question: "Dans le film Gladiator, quel est le but de Maximus ?",
      options: [
        "Devenir empereur",
        "Sauver Rome d’une invasion",
        "Venger sa famille et retrouver son honneur",
        "Fuir l’Empire",
      ],
      correct: "Venger sa famille et retrouver son honneur",
    },
    {
      question: "Où se trouve le Colisée aujourd’hui ?",
      options: ["Athènes", "Rome", "Pompéi", "Naples"],
      correct: "Rome",
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
    if (answer.trim().toUpperCase() !== correctAnswer.toUpperCase()) {
      alert("Ce n’est pas la bonne réponse…")
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
      if (isCorrect) {
        if (quizIndex < quiz.length - 1) setQuizIndex((prev) => prev + 1)
        else finishQuiz()
      } else {
        setLives((prev) => {
          const nextLives = prev - 1
          if (nextLives <= 0) {
            alert("Tu as perdu toutes tes vies ! Retour à l accueil...")
            router.push("/accueil")
          }
          return nextLives
        })
      }
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
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center text-white p-8 space-y-8 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/7/0/5/705121344c_110004_colisee-rome.jpg')",
        }}
      >
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
        ⏱️ {formatTime(timeLeft)} | ❤️ {lives}
      </div>
        <h1 className="text-4xl font-bold">🎉 Félicitations ! 🎉</h1>
        <p className="text-xl">
          Tu as percé le mystère du code de César et remporté le quiz du Colisée !
          <br />
          Tu gagnes la lettre{" "}
          <span className="text-yellow-300 font-bold text-2xl">U</span>.
        </p>

        {/* 🏛️ Carte interactive du Colisée */}
        <div className="w-full max-w-3xl h-[400px] border-2 border-yellow-400 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.349008253049!2d12.49004267644524!3d41.89021417129277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61a1362d1c81%3A0x90a70d9b1e0b4cfb!2sColosseum!5e0!3m2!1sen!2sit!4v1715340497312!5m2!1sen!2sit"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {!showVideo && (
          <Button
            onClick={() => setShowVideo(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black w-full max-w-sm py-3"
          >
            Suivant
          </Button>
        )}

        {showVideo && (
          <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden border-2 border-yellow-400 shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={VIDEO_URL}
              title="Vidéo du Colisée"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {showVideo && (
          <Button
            onClick={() => router.push("/accueil")}
            size="lg"
            className="bg-purple-700 hover:bg-purple-600 mt-4"
          >
            Retour à l'accueil
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center flex items-end justify-center text-white"
      style={{
        backgroundImage:
          "url('https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/7/0/5/705121344c_110004_colisee-rome.jpg')",
      }}
    >
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
        ⏱️ {formatTime(timeLeft)} | ❤️ {lives}
      </div>
      {!isDialogueFinished && !postPhase && !showQuiz ? (
        <div className="absolute bottom-8 w-[90%] max-w-4xl bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-lg leading-relaxed text-center">
          {dialogues[dialogueIndex]}
          <p className="text-sm text-gray-300 mt-2">(Espace ou clic pour continuer...)</p>
        </div>
      ) : null}

      {isDialogueFinished && !postPhase && !showQuiz && (
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

      {postPhase && !showQuiz && (
        <div className="absolute bottom-8 w-[90%] max-w-4xl bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-lg leading-relaxed text-center">
          {postAnswerDialogues[postDialogueIndex]}
          <p className="text-sm text-gray-300 mt-2">(Espace ou clic pour continuer...)</p>
        </div>
      )}

      {showQuiz && !showCongrats && (
        <div className="absolute bottom-8 w-[90%] max-w-4xl bg-black/70 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20 text-center space-y-4">
          <h2 className="text-2xl font-bold mb-4">{quiz[quizIndex].question}</h2>

          <div className="grid grid-cols-2 gap-4">
            {quiz[quizIndex].options.map((option, i) => (
              <Button
                key={i}
                onClick={() => handleAnswerQuiz(option)}
                disabled={!!feedback}
                className="bg-purple-700 hover:bg-purple-600 text-lg py-4"
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
        src="/img/pngtree-cartoon-character-of-greek-ancient-warrior-holding-spear-and-shield-png-image_11960426-removebg-preview.png"
        alt="Personnage"
        className="absolute bottom-0 right-0 w-[450px] md:w-[500px] select-none pointer-events-none"
      />
    </div>
  )
}
