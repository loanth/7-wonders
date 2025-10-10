"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useTimer } from "@/context/TimerContext"
import { useRouter } from "next/navigation"



const QUESTIONS = [
  {
    question: "En quelle année Pétra a-t-elle été redécouverte par l'explorateur suisse Johann Ludwig Burckhardt ?",
    options: ["1812", "1756", "1889", "1920"],
    correct: 0,
    explanation: "En 1812, Johann Ludwig Burckhardt, déguisé en marchand arabe, fut le premier Européen moderne à pénétrer dans Pétra. Cette découverte révéla au monde occidental l'une des plus grandes merveilles architecturales de l'Antiquité."
  },
  {
    question: "Quel peuple ancien a construit la cité de Pétra ?",
    options: ["Les Égyptiens", "Les Nabatéens", "Les Romains", "Les Grecs"],
    correct: 1,
    explanation: "Les Nabatéens, un peuple arabe nomade devenu sédentaire, ont construit Pétra au 4ème siècle avant J.-C. Ils ont transformé cette cité en un carrefour commercial majeur grâce à leur maîtrise du commerce caravanier."
  },
  {
    question: "Quel est le monument le plus célèbre de Pétra, taillé dans la roche ?",
    options: ["Le Colisée", "Le Trésor (Al-Khazneh)", "Le Parthénon", "La Grande Muraille"],
    correct: 1,
    explanation: "Al-Khazneh, ou 'Le Trésor', est le monument le plus emblématique de Pétra. Cette façade monumentale de 40 mètres de haut, sculptée directement dans la falaise de grès rose, servait probablement de tombeau royal."
  },
  {
    question: "Dans quel pays actuel se trouve Pétra ?",
    options: ["Égypte", "Syrie", "Jordanie", "Irak"],
    correct: 2,
    explanation: "Pétra se situe en Jordanie, dans le désert du Wadi Musa, à environ 250 km au sud de la capitale Amman. C'est aujourd'hui le site touristique le plus visité de Jordanie et un symbole national."
  },
  {
    question: "Quelle était la principale source de richesse des Nabatéens à Pétra ?",
    options: ["L'agriculture", "Le commerce caravanier", "La pêche", "L'exploitation minière"],
    correct: 1,
    explanation: "Les Nabatéens contrôlaient les routes commerciales entre l'Arabie, l'Égypte et la Méditerranée. Ils taxaient le passage des caravanes transportant encens, myrrhe, épices et soie, ce qui fit leur richesse extraordinaire."
  },
  {
    question: "Comment s'appelle l'étroit canyon qui mène à Pétra ?",
    options: ["Le Siq", "Le Wadi", "Le Djebel", "Le Nahr"],
    correct: 0,
    explanation: "Le Siq est un canyon naturel de 1,2 km de long et parfois large de seulement 3 mètres. Ses parois atteignent 80 mètres de hauteur. C'est l'entrée spectaculaire et mystérieuse qui mène au Trésor de Pétra."
  },
  {
    question: "Quelle était l'innovation majeure des Nabatéens pour survivre dans le désert ?",
    options: ["Les pyramides", "Les systèmes hydrauliques sophistiqués", "Les chariots", "Les ponts"],
    correct: 1,
    explanation: "Les Nabatéens ont développé un système hydraulique ingénieux avec des barrages, citernes et canaux pour collecter et stocker l'eau de pluie. Cette maîtrise de l'eau leur a permis de faire prospérer une ville dans le désert."
  },
  {
    question: "En quelle année Pétra a-t-elle été inscrite au patrimoine mondial de l'UNESCO ?",
    options: ["1975", "1985", "1995", "2005"],
    correct: 1,
    explanation: "Pétra a été inscrite au patrimoine mondial de l'UNESCO en 1985 pour sa valeur universelle exceptionnelle. En 2007, elle a également été désignée comme l'une des sept nouvelles merveilles du monde."
  }
]

export default function Enigme5Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [loading, setLoading] = useState(false)
  const { timeLeft, formatTime } = useTimer()
  const [showSolution, setShowSolution] = useState(false)
  const [showYTVideo, setShowYTVideo] = useState(false)
   const [lives, setLives] = useState(3) // 💜 Ajout des vies
   const router = useRouter()

  const toggleYTVideo = () => {
    setShowYTVideo(!showYTVideo)
  }
  
  // Taquin state
  const [tiles, setTiles] = useState<number[]>([])
  const [emptyIndex, setEmptyIndex] = useState(15)
  const [moves, setMoves] = useState(0)

  // Initialize puzzle
  useEffect(() => {
    if (quizCompleted && tiles.length === 0) {
      initializePuzzle()
    }
  }, [quizCompleted])

  const initializePuzzle = () => {
    // Create solved state
    const solved = Array.from({ length: 15 }, (_, i) => i + 1)
    solved.push(0) // 0 represents empty space
    
    // Shuffle with valid moves to ensure solvability
    let shuffled = [...solved]
    let empty = 15
    
    for (let i = 0; i < 200; i++) {
      const validMoves = getValidMoves(empty)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      
      // Swap
      ;[shuffled[empty], shuffled[randomMove]] = [shuffled[randomMove], shuffled[empty]]
      empty = randomMove
    }
    
    setTiles(shuffled)
    setEmptyIndex(empty)
  }

  const getValidMoves = (emptyIdx: number) => {
    const row = Math.floor(emptyIdx / 4)
    const col = emptyIdx % 4
    const moves = []
    
    if (row > 0) moves.push(emptyIdx - 4) // up
    if (row < 3) moves.push(emptyIdx + 4) // down
    if (col > 0) moves.push(emptyIdx - 1) // left
    if (col < 3) moves.push(emptyIdx + 1) // right
    
    return moves
  }

  const handleTileClick = (index: number) => {
    const validMoves = getValidMoves(emptyIndex)
    
    if (validMoves.includes(index)) {
      const newTiles = [...tiles]
      newTiles[emptyIndex] = newTiles[index]
      newTiles[index] = 0
      
      setTiles(newTiles)
      setEmptyIndex(index)
      setMoves(moves + 1)
      
      // Check if solved
      if (isPuzzleSolved(newTiles)) {
        setTimeout(() => setShowCelebration(true), 500)
      }
    }
  }

  const isPuzzleSolved = (currentTiles: number[]) => {
    for (let i = 0; i < 15; i++) {
      if (currentTiles[i] !== i + 1) return false
    }
    return currentTiles[15] === 0
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === QUESTIONS[currentQuestion].correct

    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setCorrectAnswers(correctAnswers + 1)
      setTimeout(() => {
        setShowExplanation(true)
      }, 800)
    } else {
      setTimeout(() => {
        setShowResult(false)
        setSelectedAnswer(null)
        setIsCorrect(null)
        setLives(prev => {
        const nextLives = prev - 1
        if (nextLives <= 0){
          alert("Tu as perdu toutes tes vies ! Retour à l'accueil...")
           router.push("/accueil")}
        return nextLives
      })
      }, 2000)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowResult(false)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleValidate = async () => {
  const partieId = localStorage.getItem("partieId")
  if (!partieId) {
    alert("Aucune partie en cours trouvée.")
    return
  }

  setLoading(true)
  try {
    // 🔥 Appel à ton API pour valider l’énigme
    const response = await fetch("/api/enigme/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partieId: Number.parseInt(partieId),
        enigmeId: 2 
      })
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la validation en base.")
    }

    // ✅ Succès
    alert("Bravo ! Énigme validée. Retour à l'accueil...")
    window.location.href = "/accueil" // redirige vers la page d'accueil (modifiable)
  } catch (error) {
    console.error("Erreur de validation :", error)
    alert("Une erreur est survenue lors de la validation.")
  } finally {
    setLoading(false)
  }
}


  return (
    <div 
    className="fixed inset-0 z-0"
    style={{
        backgroundImage: 'url("/travel-jordan-trail-petra.webp")',
        backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
>
  <div className="absolute inset-0 bg-black/20" />
        

      {/* Bouton "En apprendre plus" */}
<button
  onClick={toggleYTVideo}
  className="fixed top-4 left-4 z-50 bg-gradient-to-br from-amber-900/98 to-orange-900/98 border-2 border-amber-400/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white hover:text-orange-200 hover:bg-white/10"
>
  En apprendre plus
</button>

{/* Bulle avec la vidéo YouTube */}
{showYTVideo && (
  <div className="fixed top-24 left-6 z-50">
    <div className="relative bg-gradient-to-br from-amber-900/95 to-orange-900/95 border-2 border-amber-400/50 rounded-3xl p-3 shadow-2xl w-[580px] backdrop-blur-sm">
      
      {/* Petite flèche de la bulle */}
      <div className="absolute -top-3 left-10 w-0 h-0 border-l-[15px] border-l-transparent border-b-[15px] border-b-amber-900 border-r-[15px] border-r-transparent"></div>

      {/* Contenu : Vidéo */}
      <div className="rounded-2xl overflow-hidden border border-amber-400/30 shadow-lg">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/S8SG5_f27OM"
          title="Vidéo sur Pétra"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
)}


        
          {/* Overlay sombre pour lisibilité */}
          

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-200/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-white hover:text-orange-200 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux énigmes
          </Button>

          
        
          {/* Quiz Phase */}
          {!quizCompleted && !showCelebration && (
            <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center p-4 pointer-events-none">
              {/* Guide character image */}
              <img
                src="/images/petra_png.png"
                alt="Pétra"
                className="absolute right-25 bottom-0 w-64 md:w-96 select-none pointer-events-none animate-in slide-in-from-right duration-1000"
              />

              {/* Speech bubble from character */}
              <div className="absolute right-72 md:right-[5rem] bottom-110 md:bottom-120 pointer-events-none z-20">
                <div className="bg-gradient-to-br from-amber-900/98 to-orange-900/98 border-2 border-amber-400/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative max-w-xs">
                  {/* Flèche pointant vers le bas, positionnée en bas à gauche de la bulle */}
                  <div className="absolute -bottom-[15px] left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-amber-900/98"></div>
                  <div className="bg-amber-800/30 rounded-lg p-3 border border-amber-500/30">
                    <p className="text-amber-100 text-sm leading-relaxed italic">
                      "{
                        [
                          "Bienvenue, voyageur ! Prouve ta connaissance de Pétra pour percer ses mystères...",
                          "Bien joué ! Découvrons ensemble qui a bâti cette merveille...",
                          "Excellent ! Parlons maintenant du monument le plus emblématique...",
                          "Magnifique ! Sais-tu où se trouve ce trésor historique ?",
                          "Impressionnant ! Voyons ce qui a fait la richesse de cette cité...",
                          "Formidable ! Parlons de l'entrée mystérieuse de Pétra...",
                          "Remarquable ! Découvrons le secret de survie dans le désert...",
                          "Presque au but ! Une dernière question sur la reconnaissance mondiale..."
                        ][currentQuestion]
                      }"
                    </p>
                  </div>
                </div>
              </div>


            {/* Timer */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} | ❤️ {lives}
            </div>


              {/* Quiz Card - centered and at bottom */}
              <Card className="pointer-events-auto w-full max-w-2xl bg-gradient-to-br from-orange-950/98 to-amber-950/98 border-2 border-orange-400/50 shadow-2xl backdrop-blur-md">
                <CardContent className="p-4 md:p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-orange-300 font-semibold text-sm">
                      Question {currentQuestion + 1} / {QUESTIONS.length}
                    </span>
                    <span className="text-green-300 font-semibold text-sm">
                      ✓ {correctAnswers} bonnes réponses
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl text-white font-semibold mb-4">
                    {QUESTIONS[currentQuestion].question}
                  </h3>

                  <div className="grid gap-2">
                    {QUESTIONS[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => !showResult && handleAnswer(index)}
                        disabled={showResult}
                        variant="outline"
                        className={`w-full text-left justify-start py-4 text-sm md:text-base transition-all ${
                          showResult
                            ? index === QUESTIONS[currentQuestion].correct
                              ? 'bg-green-500 text-white border-green-400 hover:bg-green-500'
                              : selectedAnswer === index
                              ? 'bg-red-500 text-white border-red-400 hover:bg-red-500'
                              : 'bg-orange-950/50 text-orange-200 border-orange-800'
                            : 'bg-orange-950/70 text-orange-100 border-orange-700 hover:bg-orange-900 hover:border-orange-500'
                        }`}
                      >
                        <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`mt-3 p-3 rounded-lg text-sm ${
                      isCorrect
                        ? 'bg-green-500/20 border border-green-400 text-green-100'
                        : 'bg-red-500/20 border border-red-400 text-red-100'
                    }`}>
                      {isCorrect
                        ? '✓ Bonne réponse !'
                        : '✗ Mauvaise réponse. Réessaie !'}
                    </div>
                  )}

                  {showExplanation && (
                    <div className="mt-3 p-4 bg-amber-900/40 border-2 border-amber-500/50 rounded-lg">
                      <h4 className="text-amber-200 font-bold mb-2">📚 Le saviez-vous ?</h4>
                      <p className="text-amber-100 text-sm leading-relaxed mb-3">
                        {QUESTIONS[currentQuestion].explanation}
                      </p>
                      <Button
                        onClick={handleNextQuestion}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      >
                        {currentQuestion < QUESTIONS.length - 1 ? 'Question suivante →' : 'Commencer le puzzle 🧩'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Puzzle Phase */}
{quizCompleted && !showCelebration && (
  <div className="flex flex-col items-center">
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} | ❤️ {lives}
            </div>
    <Card className="bg-black/40 p-6 rounded-2xl backdrop-blur-md border-2 border-orange-300/50 shadow-2xl mb-4">
      <div className="text-center mb-4">
        <p className="text-orange-200 text-lg font-semibold">
          Déplacements : {moves}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 w-fit">
        {tiles.map((tile, index) => {
          // Calculate position in the grid
          const row = Math.floor(index / 4)
          const col = index % 4
          
          // Calculate which piece of the image this should show
          const pieceNumber = tile - 1 // Convert 1-15 to 0-14
          const pieceRow = Math.floor(pieceNumber / 4)
          const pieceCol = pieceNumber % 4
          
          return (
            <button
              key={index}
              onClick={() => tile !== 0 && handleTileClick(index)}
              disabled={tile === 0}
              className={`w-20 h-20 md:w-24 md:h-24 border-2 transition-all duration-200 overflow-hidden ${
                tile === 0
                  ? 'border-orange-800/50 bg-black/60 cursor-default'
                  : 'border-orange-400 cursor-pointer shadow-lg hover:scale-105 hover:border-orange-300'
              }`}
            >
              {tile !== 0 && (
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: "url('https://ih1.redbubble.net/image.1139658700.4683/raf,360x360,075,t,fafafa:ca443f4786.jpg')",
                    backgroundSize: '400% 400%',
                    backgroundPosition: `${pieceCol * 33.333}% ${pieceRow * 33.333}%`
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
      <p className="text-orange-300/70 text-sm mt-4 text-center">
        Cliquez sur une tuile adjacente à l'espace vide pour la déplacer
      </p>
      
      {/* Bouton pour afficher/masquer la solution */}
      <div className="mt-4 text-center">
        <Button
          onClick={() => setShowSolution(!showSolution)}
          variant="outline"
          className="bg-amber-900/50 text-amber-100 border-amber-500 hover:bg-amber-800"
        >
          {showSolution ? '🙈 Masquer la solution' : '💡 Voir la solution'}
        </Button>
      </div>
    </Card>

    {/* Image de la solution à droite */}
    {showSolution && (
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 animate-in slide-in-from-right duration-500">
        <Card className="bg-black/90 p-4 border-2 border-green-400/50 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-3">
            <p className="text-green-300 font-bold text-sm">✨ Solution</p>
          </div>
          <img 
            src="https://ih1.redbubble.net/image.1139658700.4683/raf,360x360,075,t,fafafa:ca443f4786.jpg"
            alt="Solution du puzzle"
            className="w-48 md:w-64 rounded-lg border-2 border-green-500/30"
          />
          <p className="text-green-200 text-xs mt-2 text-center">
            Reconstitue cette image !
          </p>
        </Card>
      </div>
    )}
  </div>
)}



          {/* Celebration */}
          {showCelebration && (
            
            <Card className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-2 border-green-400 shadow-2xl backdrop-blur-md animate-pulse">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
              ⏱️ {formatTime(timeLeft)} | ❤️ {lives}
            </div>
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Félicitations !
                </h2>
                <p className="text-xl text-green-100 mb-2">
                  Tu as reconstitué la cité perdue de Pétra en {moves} déplacements.
                </p>
                <p className="text-lg text-green-200 mb-6">
                  Tu as répondu correctement à {correctAnswers} question{correctAnswers > 1 ? 's' : ''} !
                </p>
                <div className="bg-white/10 rounded-xl p-8 mb-6 border-2 border-green-300">
                  <p className="text-green-200 mb-3 text-lg">Voici ta lettre mystère :</p>
                  <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
                    U
                  </div>
                </div>
                <Button
                  onClick={handleValidate}
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xl py-6 px-12"
                >
                  {loading ? "Validation..." : "Continuer l'aventure"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}