"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Difference {
  id: string
  top: string
  left: string
}

interface Question {
  question: string
  options: string[]
  answer: string
  img?: string
}

export default function EnigmeRioPage() {
  const router = useRouter()
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [isDialogueFinished, setIsDialogueFinished] = useState(false)
  const [foundDiffs, setFoundDiffs] = useState<string[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showImages, setShowImages] = useState(false)

  // --- Dialogues d’intro ---
  const dialogues = [
    "Salut, voyageur ! Bienvenue à Rio de Janeiro ",
    "Je suis Zeca, l’esprit du Pain de Sucre ! Ici, tout est fête, samba et mystère.",
    "Devant toi, deux images du Christ Rédempteur… mais elles ne sont pas identiques ",
    "Trouve les 7 différences pour percer le secret de Rio et accéder à l’épreuve finale !",
  ]

  // --- Coordonnées des 7 différences ---
  const differences: Difference[] = [
    { id: "1", top: "5%", left: "32%" },
    { id: "2", top: "50%", left: "66%" },
    { id: "3", top: "23%", left: "28%" },
    { id: "4", top: "23%", left: "47%" },
    { id: "5", top: "42%", left: "27%" },
    { id: "6", top: "86%", left: "11%" },
    { id: "7", top: "83%", left: "84%" },
  ]

  const quiz: Question[] = [
    { question: "Quel est le monument emblématique de Rio ?", options: ["La Tour Eiffel", "Le Christ Rédempteur", "Le Colisée", "Big Ben"], answer: "Le Christ Rédempteur", img: "/img7/34e7ffe4e9499f47dca31269703ce573.jpg" },
    { question: "Quel est le célèbre événement se déroulant au Brésil ?", options: ["La Feria", "Le Mardi Gras", "Le Carnaval de Rio", "La Fête des Morts"], answer: "Le Carnaval de Rio", img: "/img7/Viradouro-champ-2023-525_RL_1200.jpg" },
    { question: "Quelle montagne offre une vue incroyable sur la ville ?", options: ["Pain de Sucre", "Mont Fuji", "Everest", "Mont-Blanc"], answer: "Pain de Sucre", img: "/img7/Template-4000-x-2500-5-scaled.jpg" },
    { question: "Quel pays abrite Rio de Janeiro ?", options: ["Pérou", "Brésil", "Mexique", "Argentine"], answer: "Brésil", img: "/img7/Twitter-Facebook-Blog-Cov_er_1100x.webp" },
    { question: "Quelle danse traditionnelle est née ici ?", options: ["Salsa", "Tango", "Samba", "Valse"], answer: "Samba", img: "/img7/samba.jpg" },
  ]

  // --- Gestion du dialogue ---
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
    const timer = setTimeout(() => setShowImages(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // --- Clique sur une différence ---
  const handleFindDiff = (id: string) => {
    if (!foundDiffs.includes(id)) {
      setFoundDiffs((prev) => [...prev, id])
    }
  }

  // --- Quand toutes les différences sont trouvées ---
  useEffect(() => {
    if (foundDiffs.length === differences.length) {
      setTimeout(() => setShowQuiz(true), 800)
    }
  }, [foundDiffs])

  // --- Quiz ---
  const handleAnswer = (option: string) => {
    setSelectedOption(option)
    if (option === quiz[quizIndex].answer) {
      setScore((s) => s + 1)
      setFeedback("Correct !")
    } else {
      setFeedback(`Raté... La bonne réponse était : ${quiz[quizIndex].answer}`)
    }
    setTimeout(() => {
      setFeedback(null)
      if (quizIndex < quiz.length - 1) {
        setQuizIndex((q) => q + 1)
        setSelectedOption(null)
      } else {
        setShowQuiz(false)
        setShowMap(true)
      }
    }, 1500)
  }

  const handleValidate = async () => {
    const partieId = localStorage.getItem("partieId")
    if (!partieId) return
    setLoading(true)
    try {
      await fetch("/api/enigme/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 7 }),
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // --- Écran quiz ---
  if (showQuiz) {
    const current = quiz[quizIndex]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-600 to-orange-800 text-white p-8">
        <h1 className="text-3xl font-bold mb-4">Quiz de Rio 🌴 ({quizIndex + 1}/{quiz.length})</h1>
        {current.img && <img src={current.img} alt="question" className="w-96 h-64 object-cover rounded-lg mb-4" />}
        <p className="text-lg mb-6">{current.question}</p>
        <div className="flex flex-col gap-4">
          {current.options.map((opt) => (
            <Button key={opt} onClick={() => handleAnswer(opt)} className={selectedOption === opt ? "bg-yellow-400" : ""}>
              {opt}
            </Button>
          ))}
        </div>
        {feedback && <p className="mt-4">{feedback}</p>}
      </div>
    )
  }

  // --- Map ---
  if (showMap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-8 bg-gradient-to-br from-yellow-700 to-orange-900">
        <h1 className="text-3xl font-bold mb-6">Localisation de Rio 🗺️</h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.1077722908215!2d-43.21048742455067!3d-22.951916079228708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bd599fdd1f932%3A0x5b8fa5e4a4e40f6!2sChrist%20the%20Redeemer!5e0!3m2!1sen!2sbr!4v1696669694546!5m2!1sen!2sbr"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="rounded-xl shadow-lg"
        ></iframe>
        <Button className="mt-6" onClick={() => { setShowMap(false); setShowVideo(true); }}>
          Voir une vidéo
        </Button>
      </div>
    )
  }

  // --- Vidéo ---
  if (showVideo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-8 bg-gradient-to-br from-yellow-700 to-orange-900">
        <h1 className="text-3xl font-bold mb-6">Découvre Rio 🎥</h1>
        <iframe
          width="800"
          height="450"
          src="https://www.youtube.com/embed/g7KO4Pr2grY?si=ORXWFi74QWGK_ndc"
          title="Rio de Janeiro"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl shadow-lg"
        ></iframe>
        <Button className="mt-6" onClick={() => { setShowVideo(false); setShowCongrats(true) }}>
          Terminer
        </Button>
      </div>
    )
  }

  // --- Fin ---
  if (showCongrats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-yellow-700 to-orange-900 text-white p-8">
        <img src="/img7/adorable-samba-queens-in-rio-carnival-parade-clipart-free-png.webp" alt="Zeca" className="w-48 h-48 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Bravo, explorateur ! 🎉</h1>
        <p className="text-xl mb-6">
          Tu as trouvé les 7 différences, répondu au quiz et exploré Rio !  
          Score : {score} / {quiz.length}  
          L’esprit de la Samba te révèle la lettre mystique :{" "}
          <span className="text-yellow-300 font-bold text-2xl">I</span>.
        </p>
        <Button onClick={() => { handleValidate(); router.push("/accueil") }} size="lg">
          Retour à l’accueil
        </Button>
      </div>
    )
  }

  // --- Jeu des 7 différences ---
  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center text-white overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: "url('/img7/pexels-4fly-rj-1461715-2818895.jpg')" }}
    >
       {!isDialogueFinished && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/60 backdrop-blur-md rounded-xl p-6 text-lg text-center shadow-lg z-20">
          {dialogues[dialogueIndex]}
          <p className="text-sm text-gray-300 mt-2">(Espace ou clic pour continuer...)</p>
        </div>
      )}

      {isDialogueFinished && (
        <div className="relative flex gap-10">
          {/* Image originale */}
          <div className="relative">
            <img src="/img7/christ1.webp" alt="rio1" className="w-[500px] h-auto rounded-lg shadow-lg" />
          </div>

          {/* Image modifiée */}
          <div className="relative">
            <img src="/img7/christ2.png" alt="rio2" className="w-[500px] h-auto rounded-lg shadow-lg" />
            {showImages &&
              differences.map((diff) => (
                <div
                  key={diff.id}
                  onClick={() => handleFindDiff(diff.id)}
                  className={`absolute w-8 h-8 border-4 rounded-full transition-all duration-300 ${
                    foundDiffs.includes(diff.id)
                      ? "border-green-400 bg-green-400/40 scale-125"
                      : "border-transparent"
                  }`}
                  style={{ top: diff.top, left: diff.left }}
                ></div>
              ))}
          </div>
        </div>
      )}

      {isDialogueFinished && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-3 rounded-full text-lg z-20">
          Différences trouvées : {foundDiffs.length} / {differences.length}
        </div>
      )}
      <img
        src="/img7/adorable-samba-queens-in-rio-carnival-parade-clipart-free-png.webp"
        alt="Llamaq"
        className="absolute bottom-0 right-0 h-90 select-none pointer-events-none z-20"
      />
    </div>
    
    
  )
}
