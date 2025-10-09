"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, Sparkles, Home } from "lucide-react"
import { useTimer } from "@/context/TimerContext"

export default function Enigme1Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showSudoku, setShowSudoku] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const { timeLeft, formatTime } = useTimer()
  const [showYTVideo, setShowYTVideo] = useState(false)

  const toggleYTVideo = () => {
    setShowYTVideo(!showYTVideo)
  }

  // Questions sur la Grande Muraille
const questions = [
  {
    question: "Quand la construction de la Grande Muraille a-t-elle commencé ?",
    options: ["IIIe siècle av. J.-C.", "Ier siècle apr. J.-C.", "Ve siècle av. J.-C.", "Xe siècle apr. J.-C."],
    correct: "IIIe siècle av. J.-C.",
    explanation: "La construction de la Grande Muraille de Chine a débuté au IIIe siècle avant J.-C., sous le règne de Qin Shi Huang, le premier empereur de Chine. Il a ordonné la connexion et la consolidation de plusieurs fortifications régionales pour protéger son empire des invasions des peuples nomades du nord, notamment les Xiongnu. Ce gigantesque projet a marqué le début d'un chantier titanesque qui s'est poursuivi pendant plus de deux millénaires."
  },
  {
    question: "Quelle est la longueur totale de la Grande Muraille ?",
    options: ["5 000 km", "10 000 km", "20 000 km", "30 000 km"],
    correct: "20 000 km",
    explanation: "La Grande Muraille de Chine s'étend sur plus de 20 000 kilomètres, traversant montagnes, déserts et plaines. Elle relie l'est de la Chine, près de la mer de Bohai, jusqu'aux régions arides de l'ouest. Cette longueur colossale inclut non seulement les murs principaux, mais aussi les tours de guet, les tranchées et les barrages naturels utilisés comme défenses. C'est l'un des plus longs ouvrages jamais construits par l'homme."
  },
  {
    question: "Quel empereur a unifié les différentes sections de la muraille ?",
    options: ["Qin Shi Huang", "Han Wudi", "Kangxi", "Yongle"],
    correct: "Qin Shi Huang",
    explanation: "C'est Qin Shi Huang, le premier empereur de la dynastie Qin, qui a entrepris d'unifier les différents tronçons de murailles déjà construits par les royaumes chinois antérieurs. Il a ordonné leur extension et leur renforcement pour créer une ligne de défense continue au nord du pays. Ce même empereur est aussi célèbre pour son armée de terre cuite, symbole de sa puissance et de sa volonté d'immortalité."
  },
  {
    question: "Quel était le principal objectif de la Grande Muraille ?",
    options: ["Commerce", "Protection militaire", "Religion", "Tourisme"],
    correct: "Protection militaire",
    explanation: "La Grande Muraille fut d'abord conçue comme un rempart défensif contre les invasions des peuples nomades venus du nord, notamment les Mongols et les Xiongnu. Elle servait à retarder les attaques ennemies, à contrôler les déplacements de population et à sécuriser les routes commerciales. Des garnisons étaient installées dans des tours de guet pour signaler toute intrusion grâce à des signaux de fumée ou des feux."
  },
  {
    question: "Combien de dynasties ont participé à sa construction ?",
    options: ["3 dynasties", "5 dynasties", "7 dynasties", "Plus de 10 dynasties"],
    correct: "Plus de 10 dynasties",
    explanation: "La construction de la Grande Muraille s'est étalée sur près de deux mille ans, impliquant plus d'une dizaine de dynasties chinoises. Les principales contributions vinrent des dynasties Qin, Han, Sui, Tang, et surtout Ming, qui renforcèrent et perfectionnèrent la structure. Chaque époque ajoutait ses propres sections, tours et techniques, faisant de la muraille un témoignage vivant de l'évolution de la Chine impériale."
  },
  {
    question: "De quels matériaux était principalement faite la muraille ?",
    options: ["Bois et bambou", "Pierre et terre", "Bronze et fer", "Marbre et jade"],
    correct: "Pierre et terre",
    explanation: "Les matériaux utilisés pour la construction de la muraille variaient selon les régions et les ressources locales. Dans les zones montagneuses, on employait de la pierre, tandis que dans les plaines, on utilisait de la terre tassée, des briques, et parfois du bois. Ces matériaux étaient transportés à dos d'homme, de cheval ou même de chameau, rendant la tâche épuisante et souvent mortelle pour les ouvriers."
  },
  {
    question: "Peut-on vraiment voir la muraille depuis l'espace ?",
    options: ["Oui, facilement", "Non, c'est un mythe", "Seulement avec un télescope", "Uniquement la nuit"],
    correct: "Non, c'est un mythe",
    explanation: "Contrairement à la croyance populaire, la Grande Muraille de Chine n'est pas visible à l'œil nu depuis l'espace. Les astronautes ont confirmé que, bien qu'elle soit immense, sa largeur et sa couleur se confondent avec le paysage environnant. Ce mythe, apparu au XXe siècle, symbolise toutefois la grandeur de cette construction et son impact culturel à l'échelle mondiale."
  },
  {
    question: "Combien d'ouvriers ont travaillé sur la Grande Muraille ?",
    options: ["Des milliers", "Des centaines de milliers", "Des millions", "Des dizaines de millions"],
    correct: "Des millions",
    explanation: "On estime que plusieurs millions d'ouvriers, soldats, paysans et prisonniers ont participé à la construction de la Grande Muraille à travers les âges. Beaucoup y ont laissé leur vie à cause des conditions extrêmes, du froid, de la faim et des accidents. Certaines légendes racontent que les ossements des travailleurs auraient même été intégrés dans les fondations de certaines sections du mur."
  },
  {
  question: "Qui est considéré comme le plus grand des gardiens de la Grande Muraille de Chine ?",
  options: ["Le Tigre Blanc", "Le Dragon Céleste", "Le Phénix de Feu", "La Tortue Noire"],
  correct: "Le Dragon Céleste",
  explanation: "Dans la symbolique chinoise, Voyageur, (龙神, Lóng Shén) est considéré comme le plus grand des gardiens. Symbole impérial et protecteur des cieux, il incarne la puissance, la sagesse et la protection de la Chine. La Muraille est souvent décrite comme un dragon ondulant à travers les montagnes, reliant la terre et le ciel."
}

]


  const handleAnswerSelect = (answer: string) => {
  setSelectedAnswer(answer)

  if (answer === questions[currentQuestion].correct) {
    // Réponse correcte → on peut passer à la suivante après un petit délai pour voir le feedback

  } else {
    // Réponse fausse → enlève une vie et reset la sélection après un délai
    setLives(prev => prev - 1)
    
  }
}


  const [lives, setLives] = useState(3) // tu peux changer le nombre de vies initial
  useEffect(() => {
    if (lives <= 0) {
      alert("Tu as perdu toutes tes vies ! Retour à l'accueil...")
      router.push("/accueil")
    }
  }, [lives])
   const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setQuizCompleted(true)
        setTimeout(() => setShowSudoku(true), 2000)
      }
    } else {
      // mauvais choix -> enlève une vie
      setLives(lives - 1)
      setSelectedAnswer(null)
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
      await fetch("/api/enigme/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partieId: Number.parseInt(partieId), enigmeId: 4 })
      })
      router.push("/accueil")
    } catch (error) {
      console.error(error)
      alert("Erreur lors de la validation")
    } finally {
      setLoading(false)
    }
  }


// Solution complète du Sudoku
const solution = [
  ['和','长','勇','龙','守','坚','力','忠','智'],
  ['力','守','坚','智','长','忠','勇','和','龙'],
  ['忠','智','龙','和','力','勇','坚','守','长'],

  ['长','坚','守','忠','勇','力','智','龙','和'],
  ['智','和','力','长','龙','守','忠','勇','坚'],
  ['龙','勇','忠','坚','智','和','长','力','守'],

  ['勇','龙','长','守','忠','智','和','坚','力'],
  ['守','力','和','勇','坚','长','龙','智','忠'],
  ['坚','忠','智','力','和','龙','守','长','勇']
];

// Grille initiale corrigée et résoluble
const initialGrid = [
  ['','长','勇','','守','坚','','忠','智'],
  ['力','','坚','智','长','忠','勇','和','龙'],
  ['忠','智','龙','','力','','坚','','长'],
  ['长','坚','','忠','勇','力','','龙',''],
  ['智','和','力','长','龙','守','忠','勇','坚'],
  ['','勇','忠','','','和','长','力','守'],
  ['勇','','长','守','忠','','','坚',''],
  ['守','力','和','','坚','长','龙','智','忠'],
  ['坚','','智','力','','龙','守','长','勇']
];

// Ensemble des chiffres utilisés
const characters = ['长','守','力','勇','坚','和','忠','智','龙'];

// Noms symboliques des chiffres (facultatif)
const characterNames = {
  '长': 'Long / éternel',
  '守': 'Garder / défendre',
  '力': 'Force / puissance',
  '勇': 'Courage / bravoure',
  '坚': 'Solidité / fermeté',
  '和': 'Harmonie / paix',
  '忠': 'Loyauté / fidélité',
  '智': 'Sagesse / stratégie',
  '龙': 'Dragon'
};

  const [grid, setGrid] = useState(initialGrid)
  const [selectedCell, setSelectedCell] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleCellClick = (row, col) => {
    if (initialGrid[row][col] === '') {
      setSelectedCell({ row, col })
    }
  }

  const handleCharacterSelect = (char) => {
    if (selectedCell) {
      const newGrid = grid.map(row => [...row])
      newGrid[selectedCell.row][selectedCell.col] = char
      setGrid(newGrid)
      checkCompletion(newGrid)
    }
  }

  const checkCompletion = (currentGrid) => {
    const isCorrect = currentGrid.every((row, i) =>
      row.every((cell, j) => cell === solution[i][j])
    )
    setIsComplete(isCorrect)
  }

  const resetGrid = () => {
    setGrid(initialGrid)
    setIsComplete(false)
    setSelectedCell(null)
  }

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Particules décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-8">

        {/* Timer */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg font-mono text-lg">
        ⏱️ {formatTime(timeLeft)} | ❤️ {lives}
      </div>



          {/* Bouton "En apprendre plus" style boîte de dialogue compacte */}
          <button
            onClick={toggleYTVideo}
            className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-md border-2 border-yellow-400/50 rounded-xl p-4 shadow-2xl text-yellow-400 font-bold animate-in slide-in-from-bottom duration-700 hover:text-white hover:scale-105 transition-all"
          >
            En apprendre plus
          </button>

          {/* Bulle vidéo style boîte de dialogue compacte */}
          {showYTVideo && (
            <div className="fixed top-24 left-6 z-50 w-[580px] animate-in slide-in-from-bottom duration-700">
              <div className="relative bg-black/80 backdrop-blur-md rounded-xl border-2 border-yellow-400/50 shadow-2xl p-4">
                
                {/* Petite flèche de bulle */}
                <div className="absolute -top-3 left-10 w-0 h-0 border-l-[15px] border-l-transparent border-b-[15px] border-b-yellow-400 border-r-[15px] border-r-transparent"></div>

                {/* Contenu vidéo */}
                <div className="rounded-xl overflow-hidden border-2 border-yellow-400/50 shadow-lg">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/dipzTdpGURw"
                    title="La Grande Muraille de Chine - Les 7 Nouvelles Merveilles du Monde"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}







        {/* Bouton retour stylisé */}
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-yellow-400 hover:bg-white/10 transition-all duration-300"
          onClick={() => router.push("/accueil")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux énigmes
        </Button>

        {/* Bouton info flottant */}
        <Button
          variant="outline"
          className="fixed top-6 right-6 rounded-full w-14 h-14 p-0 bg-purple-600 hover:bg-purple-700 border-2 border-yellow-400 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-110 z-50"
          onClick={() => setShowInfo(!showInfo)}
        >
          <HelpCircle className="h-6 w-6 text-yellow-400" />
        </Button>

        {/* Carte info améliorée */}
          {showInfo && (
            <div className="fixed top-24 right-6 bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg shadow-2xl p-6 max-w-sm z-50 border-4 border-yellow-600 animate-in slide-in-from-top duration-300">
              <h3 className="text-2xl font-bold mb-3 text-red-900 flex items-center gap-2">
                🏯 La Grande Muraille de Chine
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                La Grande Muraille de Chine, dont la construction a commencé au 
                <strong> IIIᵉ siècle av. J.-C. sous l'empereur Qin Shi Huang</strong>, 
                est l'un des monuments les plus impressionnants de l'histoire humaine. 
                Érigée pour assurer la <strong>protection militaire</strong> du pays contre les invasions du nord, 
                elle s'étend aujourd'hui sur plus de <strong>20 000 kilomètres</strong> à travers montagnes, déserts et plaines. 
                Sa construction, qui s'est poursuivie pendant plus de <strong>2000 ans</strong>, 
                a mobilisé des <strong>millions d'ouvriers</strong> sous plus d'une dizaine de dynasties, 
                chacune ajoutant sa pierre à l'édifice.
              </p>
              <p className="text-gray-800 text-sm leading-relaxed mt-3">
                Principalement bâtie avec de la <strong>pierre, de la terre et des briques</strong>, 
                la muraille s'adapte aux paysages qu'elle traverse. 
                Contrairement à la légende populaire, elle <strong>n'est pas visible depuis l'espace</strong> à l'œil nu, 
                bien qu'elle demeure un symbole de la grandeur et de la persévérance chinoise.
              </p>
              <p className="text-gray-800 text-sm leading-relaxed mt-3">
                la Grande Muraille incarne à la fois la puissance, la culture et la mémoire du peuple chinois.
              </p>

              <Button
                variant="ghost"
                className="mt-4 w-full bg-red-800 text-white hover:bg-red-900"
                onClick={() => setShowInfo(false)}
              >
                Fermer
              </Button>
            </div>
          )}



        {/* Image de fond permanente de la Muraille */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url("/great-wall.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        >
          {/* Overlay sombre pour lisibilité */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Écran d'accueil - Style quête de jeu */}
        {!showQuiz && !showSudoku && (
          <div className="fixed inset-0 flex items-end z-10">
            {/* Personnage dragon chinois à droite */}
            <img
              src="/images/dragon-chinois-37474714-Photoroom.png"
              alt="Dragon Gardien"
              className="absolute right-4 bottom-16 w-64 md:w-150 select-none pointer-events-none animate-in slide-in-from-right duration-1000"
            />


            {/* Boîte de dialogue en bas - Version compacte */}
            <div className="w-full px-4 pb-4 animate-in slide-in-from-bottom duration-700">
              <div className="max-w-3xl mx-auto bg-black/80 backdrop-blur-md rounded-xl border-2 border-yellow-400/50 shadow-2xl p-4 relative">
                {/* Nom du personnage */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg border-2 border-yellow-300">
                    🐉
                  </div>
                  <h3 className="text-lg font-bold text-yellow-400">Le Gardien de la Muraille</h3>
                </div>

                {/* Texte de la quête */}
                <div className="mb-3">
                  <p className="text-white text-base leading-relaxed mb-2">
                    Voyageur, tu te tiens devant la section la plus ancienne de notre Muraille sacrée. 
                    Depuis des millénaires, le <span className="text-yellow-400 font-bold">Grand Gardien : Le Dragon Céleste</span> protège ce passage mystique.
                  </p>
                  <p className="text-white text-base leading-relaxed">
                    Pour franchir cette épreuve légendaire et poursuivre ton voyage, tu dois résoudre 
                    l'énigme ancestrale qui scelle cette porte...
                  </p>
                </div>

                {/* Bouton d'action */}
                <div className="flex justify-end">
                  <Button
                    className="text-base py-3 px-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-400 text-white font-bold rounded-lg shadow-lg shadow-yellow-500/50 transition-all duration-300 hover:scale-105 border-2 border-yellow-300"
                    onClick={() => setShowQuiz(true)}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Accepter l'épreuve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz sur la Grande Muraille */}
        {showQuiz && !showSudoku && (
          <div className="fixed inset-0 flex items-end z-10">
            {/* Dragon à gauche */}
            <img
              src="/images/dragon-chinois-37474714-Photoroom.png"
              alt="Dragon Gardien"
              className="absolute right-4 bottom-16 w-64 md:w-150 select-none pointer-events-none animate-in slide-in-from-right duration-1000"
            />

            {/* Boîte de quiz */}
            <div className="w-full px-4 pb-4 animate-in slide-in-from-bottom duration-700">
              <div className="max-w-3xl mx-auto bg-black/80 backdrop-blur-md rounded-xl border-2 border-yellow-400/50 shadow-2xl p-4 relative">
                {/* En-tête */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg border-2 border-yellow-300">
                      🐉
                    </div>
                    <h3 className="text-lg font-bold text-yellow-400">Le Gardien de la Muraille</h3>
                  </div>
                  <span className="text-yellow-300 text-sm font-semibold">
                    Question {currentQuestion + 1} / {questions.length}
                  </span>
                </div>

                {!quizCompleted ? (
                  <>
                    {/* Question */}
                    <div className="mb-4">
                      <p className="text-white text-base font-semibold mb-4">
                        {questions[currentQuestion].question}
                      </p>

                      {/* Options de réponse */}
                      <div className="space-y-2">
                        {questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                              selectedAnswer === option
                                ? option === questions[currentQuestion].correct
                                  ? "bg-green-500/20 border-green-400 text-green-300"
                                  : "bg-red-500/20 border-red-400 text-red-300"
                                : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-yellow-400"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>

                      {/* Explication après sélection */}
                      {selectedAnswer && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          selectedAnswer === questions[currentQuestion].correct
                            ? "bg-green-500/20 border-2 border-green-400"
                            : "bg-red-500/20 border-2 border-red-400"
                        }`}>
                          <p className="text-white text-sm">
                            {selectedAnswer === questions[currentQuestion].correct ? "✓ Correct ! " : "✗ Incorrect. "}
                            {questions[currentQuestion].explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bouton suivant */}
                    {selectedAnswer === questions[currentQuestion].correct && (
                      <div className="flex justify-end">
                        <Button
                          onClick={handleNextQuestion}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold"
                        >
                          {currentQuestion < questions.length - 1 ? "Question suivante" : "Terminer le quiz"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                      Félicitations !
                    </h3>
                    <p className="text-white mb-4">
                      Tu as prouvé ta connaissance de la Grande Muraille.
                      <br />
                      Maintenant, place à l'épreuve finale : le Sudoku des Gardiens Sacrés !
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sudoku - Affiché au centre de l'écran */}
        {showSudoku && (
          <div className="flex items-center justify-center min-h-screen py-8">
            <div className="w-full max-w-4xl mx-auto animate-in zoom-in duration-500">
              <div className="bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100 rounded-2xl shadow-2xl p-6 md:p-8 border-8 border-yellow-600 relative overflow-hidden">
                {/* Décoration coins */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-red-800 opacity-20 rounded-br-full" />
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-800 opacity-20 rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-red-800 opacity-20 rounded-tr-full" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-red-800 opacity-20 rounded-tl-full" />

                {/* Titre central */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-orange-600 mb-2">
                    🐉 Le Sudoku des Gardiens 🐉
                  </h2>
                  <p className="text-red-800 font-semibold">Placez les neuf gardiens sacrés</p>
                </div>

                {/* Instructions stylisées */}
                <div className="mb-6 p-4 bg-gradient-to-r from-red-100 to-orange-100 border-4 border-red-800 rounded-xl shadow-lg">
                  <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2">
                    📜 Règles du jeu
                  </h3>
                  <p className="text-sm text-red-800 mb-2">
                    Dans ce Sudoku des Gardiens Sacrés, chaque <strong>ligne</strong>, chaque <strong>colonne</strong> et chaque <strong>carré 3×3</strong> doit contenir les 9 <strong>valeurs, idées et forces liées à la Grande Muraille</strong> exactement une fois, sans répétition.
                  </p>
                  <p className="text-sm text-red-800 mb-2">
                    Chaque valeur représente une force mystique et veille sur la muraille. Réparties correctement, elles protègent la section sacrée et maintiennent l'harmonie du royaume.
                  </p>
                  <p className="text-sm text-red-800">
                    Prenez votre temps, observez bien chaque case et utilisez votre logique pour positionner les gardiens sans enfreindre les règles. 🏯
                  </p>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-sm text-red-600 underline hover:text-red-800 font-semibold transition-colors"
                  >
                    {showHint ? '🔼 Masquer' : '🔽 Afficher'} les valeurs
                  </button>
                  {showHint && (
                    <div className="mt-4 grid grid-cols-3 gap-3 bg-white/60 p-3 rounded-lg">
                      {characters.map(char => (
                        <div key={char} className="flex items-center gap-2 text-red-900 bg-yellow-100 p-2 rounded-lg shadow">
                          <span className="text-2xl">{char}</span>
                          <span className="text-xs font-semibold">{characterNames[char]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grille de Sudoku améliorée */}
                <div className="mb-6 flex justify-center">
                  <div className="inline-block bg-red-900 p-2 rounded-xl shadow-2xl">
                    {grid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => {
                          const isInitial = initialGrid[rowIndex][colIndex] !== ''
                          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                          const isCorrect = cell === solution[rowIndex][colIndex]
                          const showError = cell && !isCorrect

                          return (
                            <div
                              key={colIndex}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              className={`
                                w-12 h-12 md:w-14 md:h-14 m-0.5 flex items-center justify-center text-2xl md:text-3xl font-bold
                                rounded-lg cursor-pointer transition-all duration-200 shadow-md
                                ${isInitial 
                                  ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-red-900 cursor-not-allowed shadow-inner' 
                                  : 'bg-gradient-to-br from-amber-50 to-white text-red-800 hover:from-amber-100 hover:to-amber-50 hover:shadow-lg'}
                                ${isSelected ? 'ring-4 ring-blue-500 scale-110 shadow-xl' : ''}
                                ${showError ? 'bg-gradient-to-br from-red-300 to-red-400 animate-pulse' : ''}
                                ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'mr-2' : ''}
                                ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'mb-2' : ''}
                              `}
                            >
                              {cell}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sélection des caractères améliorée */}
                {selectedCell && !isComplete && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 border-4 border-blue-600 rounded-xl shadow-lg animate-in slide-in-from-bottom duration-300">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 text-center">
                      ✨ Choisissez un gardien ✨
                    </h3>
                    <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
                      {characters.map(char => (
                        <button
                          key={char}
                          onClick={() => handleCharacterSelect(char)}
                          className="aspect-square bg-gradient-to-br from-white to-blue-50 hover:from-blue-100 hover:to-cyan-100 
                            text-blue-800 text-3xl md:text-4xl rounded-xl shadow-md 
                            transition-all hover:scale-110 border-3 border-blue-400 hover:border-blue-600 hover:shadow-xl"
                        >
                          {char}
                        </button>
                      ))}
                      <button
                        onClick={() => handleCharacterSelect('')}
                        className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-sm font-bold rounded-xl shadow-md 
                                 transition-all hover:scale-110 border-3 border-gray-400"
                      >
                        ✕<br/>Effacer
                      </button>
                    </div>
                  </div>
                )}

                {/* Message de victoire spectaculaire */}
                {isComplete && (
                  <div className="mb-6 p-8 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-2xl shadow-2xl animate-in zoom-in duration-500 border-4 border-yellow-400">
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div className="text-7xl animate-bounce">🎉</div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
                        ÉNIGME RÉSOLUE !
                      </h2>
                      <p className="text-white text-xl font-semibold text-center">
                        Le secret de la Grande Muraille est révélé !
                        <br />
                       Voici ta lettre mystère :
                      </p>
                      <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
                    R
                  </div>
                      <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Button
                          onClick={handleValidate}
                          disabled={loading}
                          className="px-8 py-6 text-lg bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-400 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/50 transition-all duration-300 hover:scale-105 border-2 border-yellow-300"
                        >
                          <Home className="mr-2 h-6 w-6" />
                          {loading ? "Validation..." : "Retour à l'accueil"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contrôles */}
                {!isComplete && (
                  <div className="flex justify-center">
                    <button
                      onClick={resetGrid}
                      className="px-8 py-4 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl 
                               shadow-lg transition-all hover:scale-105 border-2 border-red-600"
                    >
                      🔄 Recommencer
                    </button>
                  </div>
                )}

                {/* Footer décoratif */}
                <div className="mt-6 text-center">
                  <div className="inline-block bg-gradient-to-r from-red-800 to-orange-800 text-yellow-300 px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                    🐉 Le gardien protège la Muraille depuis des millénaires 🐉
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}