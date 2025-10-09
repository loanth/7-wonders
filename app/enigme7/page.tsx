"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTimer } from "@/context/TimerContext"

interface Difference {
  id: string
  top: string
  left: string
}

interface Question {
  question: string
  options: string[]
  correct: string
  img?: string
}

export default function EnigmeRioPage() {
  const router = useRouter()
  const { timeLeft, formatTime } = useTimer()

  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [isDialogueFinished, setIsDialogueFinished] = useState(false)
  const [foundDiffs, setFoundDiffs] = useState<string[]>([])
  const [postPhase, setPostPhase] = useState(false)
  const [postDialogueIndex, setPostDialogueIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showImages, setShowImages] = useState(false)

  // 💬 Dialogues d’intro
  const dialogues = [
    "Salut, voyageur ! Bienvenue à Rio de Janeiro 🌴",
    "Je suis Zeca, l’esprit du Pain de Sucre. Ici, tout est fête, samba et mystère...",
    "Devant toi se trouvent deux images du Christ Rédempteur… mais elles cachent des secrets.",
    "Trouve les 7 différences, et le carnaval de Rio t’ouvrira son cœur 🎭",
  ]

  // 🔍 Coordonnées des différences
  const differences: Difference[] = [
    { id: "1", top: "5%", left: "32%" },
    { id: "2", top: "50%", left: "66%" },
    { id: "3", top: "23%", left: "28%" },
    { id: "4", top: "23%", left: "47%" },
    { id: "5", top: "42%", left: "27%" },
    { id: "6", top: "86%", left: "11%" },
    { id: "7", top: "83%", left: "84%" },
  ]

  // 🎭 Dialogues après le jeu des différences
  const postDialogues = [
    "Incroyable ! Tes yeux sont plus affûtés qu’un couteau à churrasco 🔪",
    "Le Christ Rédempteur t’a observé du haut de ses 710 mètres...",
    "Tu sais, cette statue fut inaugurée en 1931 et fait 38 mètres de haut !",
    "Mais Rio ne se résume pas à sa statue : c’est aussi la samba, le carnaval, et l’âme du Brésil 🇧🇷",
    "Voyons si tu connais bien cette ville magique... à toi de jouer !",
  ]

  // 🧠 Quiz
  const quiz: Question[] = [
    { question: "Quel est le monument emblématique de Rio ?", options: ["La Tour Eiffel", "Le Christ Rédempteur", "Le Colisée", "Big Ben"], correct: "Le Christ Rédempteur", img: "/img7/34e7ffe4e9499f47dca31269703ce573.jpg" },
    { question: "Quel est le célèbre événement se déroulant au Brésil ?", options: ["La Feria", "Le Mardi Gras", "Le Carnaval de Rio", "La Fête des Morts"], correct: "Le Carnaval de Rio", img: "/img7/Viradouro-champ-2023-525_RL_1200.jpg" },
    { question: "Quelle montagne offre une vue incroyable sur la ville ?", options: ["Pain de Sucre", "Mont Fuji", "Everest", "Mont-Blanc"], correct: "Pain de Sucre", img: "/img7/Template-4000-x-2500-5-scaled.jpg" },
    { question: "Quel pays abrite Rio de Janeiro ?", options: ["Pérou", "Brésil", "Mexique", "Argentine"], correct: "Brésil", img: "/img7/Twitter-Facebook-Blog-Cov_er_1100x.webp" },
    { question: "Quelle danse traditionnelle est née ici ?", options: ["Salsa", "Tango", "Samba", "Valse"], correct: "Samba", img: "/img7/samba.jpg" },
  ]

  // --- Gestion des dialogues initiaux
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
  }, [isDialogueFinished])

  useEffect(() => {
    const timer = setTimeout(() => setShowImages(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // 🖱️ Clique sur une différence
  const handleFindDiff = (id: string) => {
    if (!foundDiffs.includes(id)) {
      setFoundDiffs((prev) => [...prev, id])
    }
  }

  // 🧩 Quand toutes les différences sont trouvées
  useEffect(() => {
    if (foundDiffs.length === differences.length) {
      setTimeout(() => {
        setIsDialogueFinished(false)
        setPostPhase(true)
      }, 800)
    }
  }, [foundDiffs])

  // 🎭 Gestion du dialogue post-jeu
  useEffect(() => {
    if (!postPhase) return
    const handleNextPost = (e: KeyboardEvent | MouseEvent) => {
      if ((e as KeyboardEvent).code === "Space" || (e as MouseEvent).type === "click") {
        setPostDialogueIndex((prev) => {
          if (prev < postDialogues.length - 1) return prev + 1
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

  // 🎯 Réponses du quiz
  const handleAnswerQuiz = (option: string) => {
    const current = quiz[quizIndex]
    const isCorrect = option === current.correct
    setFeedback(isCorrect ? "✅ Bonne réponse !" : `❌ Raté ! Réponse : ${current.correct}`)
    if (isCorrect) setScore((s) => s + 1)

    setTimeout(() => {
      setFeedback(null)
      if (quizIndex < quiz.length - 1) setQuizIndex((q) => q + 1)
      else {
        setShowQuiz(false)
        setShowVideo(true)
      }
    }, 1500)
  }

  // 🎬 Fin du flow : vidéo → map → félicitations
  const handleVideoNext = () => {
    setShowVideo(false)
    setShowMap(true)
  }

  const handleFinish = async () => {
    setShowMap(false)
    setShowCongrats(true)
    const partieId = localStorage.getItem("partieId")
    if (!partieId) return
    setLoading(true)
    try {
      await fetch("/api/enigme/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 7 }),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 🎉 Écran final
  if (showCongrats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-yellow-700 to-orange-900 text-white p-8">
        <img src="/img7/adorable-samba-queens-in-rio-carnival-parade-clipart-free-png.webp" alt="Zeca" className="w-48 h-48 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Bravo, explorateur du carnaval ! 🎉</h1>
        <p className="text-xl mb-6">
          Tu as percé les mystères de Rio et répondu à toutes les questions !  
          <br />Score : {score} / {quiz.length}
          <br />
          La lettre mystique t’est révélée : <span className="text-yellow-300 font-bold text-2xl">LI</span>
        </p>
        <Button onClick={() => router.push("/accueil")} size="lg">Retour à l’accueil</Button>
      </div>
    )
  }

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center text-white overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: "url('/img7/pexels-4fly-rj-1461715-2818895.jpg')" }}
    >
      {/* ⏱ Timer */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
        ⏱️ {formatTime(timeLeft)}
      </div>

      {/* Jeu des 7 différences */}
      {isDialogueFinished && !postPhase && !showQuiz && !showVideo && !showMap && (
        <div className="relative flex gap-10">
          <div className="relative">
            <img src="/img7/christ1.webp" alt="rio1" className="w-[500px] h-auto rounded-lg shadow-lg" />
          </div>
          <div className="relative">
            <img src="/img7/christ2.png" alt="rio2" className="w-[500px] h-auto rounded-lg shadow-lg" />
            {showImages && differences.map((diff) => (
              <div key={diff.id} onClick={() => handleFindDiff(diff.id)}
                className={`absolute w-8 h-8 border-4 rounded-full transition-all duration-300 ${foundDiffs.includes(diff.id) ? "border-green-400 bg-green-400/40 scale-125" : "border-transparent"}`}
                style={{ top: diff.top, left: diff.left }}></div>
            ))}
          </div>
        </div>
      )}

      {/* Compteur différences */}
      {isDialogueFinished && !postPhase && !showQuiz && !showVideo && !showMap && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-3 rounded-full text-lg z-20">
          Différences trouvées : {foundDiffs.length} / {differences.length}
        </div>
      )}

      {/* Personnage */}
      <img
        src="/img7/adorable-samba-queens-in-rio-carnival-parade-clipart-free-png.webp"
        alt="Zeca"
        className="absolute bottom-0 right-0 h-90 select-none pointer-events-none z-20"
      />

      {/* Bulle dialogues / quiz / vidéo / map */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/60 backdrop-blur-md rounded-xl p-6 text-lg text-center shadow-lg z-20 space-y-4">
        {!isDialogueFinished && !postPhase && !showQuiz && !showVideo && !showMap ? (
          <>
            {dialogues[dialogueIndex]}
            <p className="text-sm text-gray-300 mt-2">(Espace ou clic pour continuer...)</p>
          </>
        ) : null}

        {postPhase && !showQuiz && !showVideo && !showMap && (
          <>
            {postDialogues[postDialogueIndex]}
            <p className="text-sm text-gray-300 mt-2">(Espace ou clic pour continuer...)</p>
          </>
        )}

        {showQuiz && !showVideo && !showMap && (
          <>
            <h2 className="text-2xl font-bold mb-4">{quiz[quizIndex].question}</h2>
            {quiz[quizIndex].img && <img src={quiz[quizIndex].img} className="w-80 h-48 object-cover rounded-lg mb-4 mx-auto" />}
            <div className="grid grid-cols-2 gap-4">
              {quiz[quizIndex].options.map((opt, i) => (
                <Button key={i} onClick={() => handleAnswerQuiz(opt)} disabled={!!feedback} className="bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4">
                  {opt}
                </Button>
              ))}
            </div>
            {feedback && <p className={`mt-4 font-semibold ${feedback.includes("Bonne") ? "text-green-400" : "text-red-400"}`}>{feedback}</p>}
            <p className="text-sm text-gray-300 mt-2">Question {quizIndex + 1} / {quiz.length}</p>
          </>
        )}

        {showVideo && !showMap && (
          <>
            <h2 className="text-2xl font-bold mb-4">Découvre Rio 🎥</h2>
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/g7KO4Pr2grY?si=ORXWFi74QWGK_ndc"
              title="Rio de Janeiro"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl shadow-lg"
            ></iframe>
            <Button className="mt-4" onClick={handleVideoNext}>Voir la map</Button>
          </>
        )}

        {showMap && !showVideo && (
          <>
            <h2 className="text-2xl font-bold mb-4">Localisation de Rio 🗺️</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.1077722908215!2d-43.21048742455067!3d-22.951916079228708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bd599fdd1f932%3A0x5b8fa5e4a4e40f6!2sChrist%20the%20Redeemer!5e0!3m2!1sen!2sbr!4v1696669694546!5m2!1sen!2sbr"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-xl shadow-lg"
            ></iframe>
            <Button className="mt-4" onClick={handleFinish}>Terminer</Button>
          </>
        )}
      </div>
    </div>
  )
}
