"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTimer } from "@/context/TimerContext"

interface Artefact {
  id: string
  top: string
  left: string
  img: string
  name: string
  description: string
}

interface Question {
  question: string
  options: string[]
  answer: string
  img?: string
}

export default function Enigme6Page() {
  const router = useRouter()
  const { timeLeft, formatTime } = useTimer()

  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [dialogueFinished, setDialogueFinished] = useState(false)
  const [foundObjects, setFoundObjects] = useState<string[]>([])
  const [currentPopup, setCurrentPopup] = useState<Artefact | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showObjects, setShowObjects] = useState(false)

  // Ajout du compteur de vies 🔥
  const [lives, setLives] = useState(3)

  const dialogues = [
    "Oh... un voyageur ? Héhé, ça faisait longtemps qu’un humain n’avait gravi ces marches...",
    "Je suis Llamaq, le gardien mystique du Machu Picchu, protecteur des secrets du Soleil.",
    "Cinq artefacts sacrés ont été perdus : la Chakana, le Tumi, le Quipu, la Manta et le Disque d’Inti.",
    "Ils reposent quelque part dans ces ruines, dissimulés aux yeux des profanes...",
    "Trouve-les tous, et le Soleil te proposera une épreuve finale."
  ]

  const objects: Artefact[] = [
    { id: "chakana", top: "70%", left: "72%", img: "/img6/53570731338_2a6d1ebfa0_o-removebg-preview.png", name: "Chakana", description: "La Chakana, ou Croix Andine, représente les trois mondes : le monde souterrain, le monde terrestre et le monde céleste. Symbole sacré de l’Inca." },
    { id: "tumi", top: "68%", left: "58%", img: "/img6/21287AUDl.png", name: "Tumi", description: "Le Tumi est un couteau cérémoniel utilisé par les Incas pour les rituels et sacrifices. Sa forme en demi-lune est emblématique." },
    { id: "quipu", top: "90%", left: "75%", img: "/img6/quipa.png", name: "Quipu", description: "Le Quipu est une corde à nœuds utilisée pour enregistrer des informations et des calculs dans la civilisation inca." },
    { id: "manta", top: "50%", left: "99%", img: "/img6/Tupa-inca-tunic.png", name: "Manta", description: "La Manta est un tissu traditionnel que les Incas utilisaient pour se vêtir et transporter des objets." },
    { id: "inti", top: "88%", left: "52%", img: "/img6/Screenshot-from-2025-07-06-17-46-33-removebg-preview.png", name: "Inti", description: "Inti est le dieu du Soleil, principal dieu des Incas. Ce disque d’or représente sa puissance et son rôle protecteur." }
  ]

  const quiz: Question[] = [
    { question: "Qui est Inti ?", options: ["Le dieu de la Lune", "Le dieu du Soleil", "Un artefact", "Un prêtre"], answer: "Le dieu du Soleil", img: "/img6/maxresdefault.jpg" },
    { question: "Quelle est la forme du Tumi ?", options: ["Demi-lune", "Triangle", "Carré", "Cercle"], answer: "Demi-lune", img: "/img6/Ethnologisches_Museum_Dahlem_Berlin_Mai_2006_002.jpg" },
    { question: "La Chakana représente ?", options: ["Les 3 mondes", "Les 4 saisons", "Les 5 continents", "Les 7 planètes"], answer: "Les 3 mondes", img: "/img6/chakana-andean-cross-stone-wiracocha-600nw-2477011513.webp" },
    { question: "Le Quipu sert à ?", options: ["Mesurer le temps", "Enregistrer des informations", "Sacrifier des animaux", "Vêtir les nobles"], answer: "Enregistrer des informations", img: "/img6/quipu-2_0.webp" },
    { question: "La Manta est utilisée pour ?", options: ["Se vêtir et transporter des objets", "Cuisiner", "Sacrifier", "Construire"], answer: "Se vêtir et transporter des objets", img: "/img6/il_570xN.5845905285_kekl.webp" },
    { question: "Le Machu Picchu se trouve ?", options: ["Chine", "Pérou", "Mexique", "Brésil"], answer: "Pérou", img: "/img6/perou_1680_compressor_3_419eca7299.webp" },
    { question: "Qui protège les secrets du Soleil ?", options: ["Llamaq", "Inti", "Tumi", "Quipu"], answer: "Llamaq", img: "/img6/pngtree-funny-peruvian-llama-alpaca-kids-cartoon-character-png-image_12531923.png" }
  ]

  // Dialogue navigation
  useEffect(() => {
    const handleNext = (e: KeyboardEvent | MouseEvent) => {
      if ((e as KeyboardEvent).code === "Space" || (e as MouseEvent).type === "click") {
        setDialogueIndex(prev => {
          if (prev < dialogues.length - 1) return prev + 1
          else {
            setDialogueFinished(true)
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
  }, [])

  // Affichage objets
  useEffect(() => {
    const timer = setTimeout(() => setShowObjects(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleFindObject = (id: string) => {
    if (!foundObjects.includes(id)) {
      const artefact = objects.find(o => o.id === id)
      if (artefact) {
        setFoundObjects(prev => [...prev, id])
        setCurrentPopup(artefact)
      }
    }
  }

  // Lancer le quiz après avoir trouvé tous les objets
  useEffect(() => {
    if (foundObjects.length === objects.length && !currentPopup) {
      setShowQuiz(true)
    }
  }, [foundObjects, currentPopup])

  // --- GESTION DU QUIZ AVEC VIES ET BLOQUAGE 🔥 ---
  const handleAnswer = (option: string) => {
    if (selectedOption) return // empêche le spam

    setSelectedOption(option)

    if (option === quiz[quizIndex].answer) {
      setScore(s => s + 1)
      setFeedback("✅ Bonne réponse !")
      setTimeout(() => {
        setFeedback(null)
        setSelectedOption(null)
        if (quizIndex < quiz.length - 1) {
          setQuizIndex(q => q + 1)
        } else {
          setShowQuiz(false)
          setShowMap(true)
        }
      }, 1000)
    } else {
      // Mauvaise réponse
      setLives(l => l - 1)
      setFeedback(`❌ Mauvaise réponse... Essaie encore ! (${lives - 1} vies restantes)`)
      setSelectedOption(null)

      // Si plus de vies → retour à l'accueil
      if (lives - 1 <= 0) {
        alert("Tu as épuisé toutes tes vies ! Tu vas être redirigé vers l'accueil.")
        setTimeout(() => router.push("/accueil"), 1000)
      }
    }
  }

  const handleValidate = async () => {
    const partieId = localStorage.getItem("partieId")
    if (!partieId) return
    setLoading(true)
    try {
      await fetch("/api/enigme/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 6 })
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // --- RENDER ---
  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center text-white overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: "url('/img6/Fotolia_58385181_Mysterious-city-Machu-Picchu-PeruSouth-America.-©-vitmark-recoupee.jpg.webp')" }}
    >
      {/* Timer */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
        ⏱️ {formatTime(timeLeft)} | ❤️ {lives}
      </div>

      

      {/* Artefacts */}
      {objects.map(obj => (
        <img
          key={obj.id}
          src={obj.img}
          alt={obj.name}
          onClick={() => handleFindObject(obj.id)}
          className={`absolute w-12 h-12 cursor-pointer transition-all duration-500 ${
            foundObjects.includes(obj.id)
              ? "opacity-0 scale-125 pointer-events-none"
              : showObjects
              ? "opacity-80 hover:scale-110 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{ top: obj.top, left: obj.left, zIndex: 10 }}
        />
      ))}

      {!currentPopup && (
        <div className="absolute top-6 left-1/10 -translate-x-1/2 bg-black/60 px-6 py-3 rounded-full text-lg z-20">
          Artefacts trouvés : {foundObjects.length} / {objects.length}
        </div>
      )}

      {currentPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 p-6">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-black text-center shadow-lg relative">
            <img src={currentPopup.img} alt={currentPopup.name} className="mx-auto w-32 h-32 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{currentPopup.name}</h2>
            <p className="text-md mb-4">{currentPopup.description}</p>
            <Button onClick={() => setCurrentPopup(null)} className="bg-purple-700 hover:bg-purple-600 text-white">
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Personnage */}
      <img
        src="/img6/pngtree-funny-peruvian-llama-alpaca-kids-cartoon-character-png-image_12531923.png"
        alt="Llamaq"
        className="absolute bottom-0 right-0 h-80 select-none pointer-events-none z-20"
      />

      {/* Dialogue */}
      {!dialogueFinished && !currentPopup && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/60 rounded-xl p-6 text-lg text-center z-20">
          {dialogues[dialogueIndex]}
          <p className="text-sm text-gray-300 mt-2">(Appuie sur espace ou clique pour continuer...)</p>
        </div>
      )}

      {/* Quiz */}
      {showQuiz && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/60 rounded-xl p-6 text-lg text-center z-30">
          <h2 className="text-2xl font-bold mb-4">Quiz : {quizIndex + 1} / {quiz.length}</h2>
          {quiz[quizIndex].img && <img src={quiz[quizIndex].img} alt="question" className="w-full max-h-64 object-contain mb-4 mx-auto" />}
          <p className="mb-4">{quiz[quizIndex].question}</p>
          <div className="flex flex-col gap-2">
            {quiz[quizIndex].options.map(option => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedOption}
                className={selectedOption === option ? "bg-yellow-500" : ""}
              >
                {option}
              </Button>
            ))}
          </div>
          {feedback && <p className="mt-2">{feedback}</p>}
        </div>
      )}

      {/* Map */}
      {showMap && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/60 rounded-xl p-6 text-lg text-center z-30">
          <h2 className="text-2xl font-bold mb-4">Localisation du Machu Picchu 🗺️</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.633871309394!2d-72.54512838480284!3d-13.16314109065807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91176a2e3e0b9e5b%3A0x9a1f9e18f1c5e50f!2sMachu%20Picchu!5e0!3m2!1sfr!2s!4v1696669694546!5m2!1sfr!2s"
            width="100%"
            height="300"
            className="rounded-xl"
          ></iframe>
          <Button className="mt-4" onClick={() => { setShowMap(false); setShowVideo(true); }}>Voir la vidéo</Button>
        </div>
      )}

      {/* Vidéo */}
      {showVideo && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/60 rounded-xl p-6 text-lg text-center z-30">
          <h2 className="text-2xl font-bold mb-4">Découvre Machu Picchu</h2>
          <iframe
            width="100%"
            height="300"
            src="https://www.youtube.com/embed/xa5v68KhXAk"
            title="Découverte Machu Picchu"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl"
          ></iframe>
          <Button className="mt-4" onClick={() => { setShowVideo(false); setShowCongrats(true); }}>Terminer</Button>
        </div>
      )}

      {/* Ecran final */}
      {showCongrats && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-6 z-50">
          <img src="/img6/pngtree-funny-peruvian-llama-alpaca-kids-cartoon-character-png-image_12531923.png" alt="Llamaq" className="w-64 h-64 mb-4" />
          <h1 className="text-4xl font-bold mb-4">Bravo, explorateur !</h1>
          <p className="text-xl mb-4">
            Tu as retrouvé les cinq artefacts sacrés, répondu au quiz et exploré Machu Picchu !<br />
            Score : {score} / {quiz.length}<br />
            Le Soleil te révèle la lettre mystique : <span className="text-yellow-300 font-bold text-2xl">T</span>
          </p>
          <Button onClick={() => { handleValidate(); router.push("/accueil") }} size="lg">Retour à l'accueil</Button>
        </div>
      )}
    </div>
  )
}
