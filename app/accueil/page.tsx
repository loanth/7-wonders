"use client"

import { useEffect, useState } from "react"
import SplineScene from "@/components/SplineScene"
import { useSearchParams, useRouter } from "next/navigation"
import { WonderCard } from "@/components/wonder-card"
import { wonders } from "@/lib/wonders"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import SplineScene2 from "@/components/SplineScene2"

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const wonderId = searchParams.get("id")

  const selectedWonder = wonderId
    ? wonders.find((w) => w.id === Number.parseInt(wonderId))
    : null

  const [partieData, setPartieData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showFinalChallenge, setShowFinalChallenge] = useState(false)
  const [letters, setLetters] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(45 * 60)

  // ⏱️ Timer persistant
  useEffect(() => {
    const storedStartTime = localStorage.getItem("timerStart")
    let startTime: number

    if (storedStartTime) {
      startTime = parseInt(storedStartTime)
    } else {
      startTime = Date.now()
      localStorage.setItem("timerStart", startTime.toString())
    }

    const updateTimer = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      const remaining = 45 * 60 - elapsedSeconds

      if (remaining <= 0) {
        setTimeLeft(0)
        localStorage.removeItem("timerStart")
        router.push("/perdu")
      } else {
        setTimeLeft(remaining)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [router])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  // 🔄 Fetch partie
  useEffect(() => {
    const fetchPartie = async () => {
      const partieId = localStorage.getItem("partieId")

      

      if (!partieId) {
     
        setLoading(false)
        return
      }

      try {
        
        const res = await fetch(`/api/partie/${partieId}`, { cache: "no-store" })
        const data = await res.json()

  

        if (res.ok && data.partie) {
          setPartieData(data.partie)
        } else {
          
        }
      } catch (err) {
       
      } finally {
        setLoading(false)
      }
    }

    fetchPartie()
  }, [])

  // 🔐 Merveilles bloquées / terminées
  const lockedWonders = partieData
    ? wonders.filter((w) => partieData?.[`m${w.id}`] === false)
    : []

  const completedWonders = partieData
    ? wonders.filter((w) => partieData?.[`m${w.id}`] === true)
    : []

  const allCompleted =
    partieData &&
    ["m1", "m2", "m3", "m4", "m5", "m6", "m7"].every((key) => partieData[key] === true)

  // 🧩 Lettres finales
  useEffect(() => {
    const fixedOrder = ["R", "T", "E", "U", "L", "C", "U"]
    setLetters(fixedOrder)
  }, [showFinalChallenge])

  const handleDragStart = (index: number) => setDraggedIndex(index)
  const handleDrop = (index: number) => {
    if (draggedIndex === null) return
    const updated = [...letters]
    const [moved] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, moved)
    setLetters(updated)
    setDraggedIndex(null)
  }

  const checkIfCorrect = () => {
    if (letters.join("") === "CULTURE") setIsCompleted(true)
    else alert("Pas encore... essaie une autre combinaison !")
  }

  // 👀 Affichage du chargement ou debug
  if (loading)
    return (
      <div className="text-white text-center mt-20">
        Chargement de la partie...
      </div>
    )

  if (!partieData) {
    return (
      <div className="text-white text-center mt-20">
        Impossible de charger les données de la partie, rechargez le site. 
      </div>
    )
  }

// 🎉 Écran final de félicitations
  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">

      <SplineScene2 />
    
        <Button
          onClick={() => router.push("../")}
          style={{ position: 'absolute', bottom: 0, }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-transform"
        >
          Retour à la connexion
        </Button>
    
</div>
    )
  }


  

  // 🧩 Challenge final interactif
  if (showFinalChallenge) {
    return (
<main className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
<h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Dernier défi
</h1>
<p className="text-gray-300 mb-8 text-center">
          Réarrange les lettres pour trouver le mot mystère :
</p>
 
        <div className="flex gap-3 mb-6 text-3xl font-bold tracking-widest flex-wrap justify-center">
          {letters.map((l, i) => (
<div
              key={i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="bg-zinc-800 px-5 py-3 rounded-xl border border-purple-500/40 select-none cursor-move hover:bg-purple-700/30 transition-transform duration-150 active:scale-110"
>
              {l}
</div>
          ))}
</div>
 
        <Button
          onClick={checkIfCorrect}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-transform"
>
          Valider le mot
</Button>
</main>
    )
  }

  // ✅ Tout le rendu normal ci-dessous...
  return (
    <main className="min-h-screen w-full bg-black text-white overflow-y-auto relative">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none" />

      {/* Timer */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg shadow-purple-900/30 font-mono text-lg">
        ⏱️ {formatTime(timeLeft)}
      </div>

      {/* Spline Scene */}
      <section className="relative h-[75vh] flex">
        <div className="w-full h-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500 pointer-events-none z-10" />
          <SplineScene />
        </div>

        {selectedWonder && (
          <div className="md:block overflow-hidden h-full bg-zinc-900/40 backdrop-blur-xl border-l border-purple-500/30 p-6 shadow-2xl shadow-purple-500/20 animate-fadeInUp">
            <WonderCard wonder={selectedWonder} />
          </div>
        )}
        
      </section>

      {/* Section Merveilles */}
      <section className="relative z-10 px-4 py-16 bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Bouton final */}
        <h2 className="text-xl text-center font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-500">
              Cliquez sur les pins du globe pour résoudre les énigmes associée aux merveilles
            </h2>
        {allCompleted && !showFinalChallenge && (
          <div className="flex justify-center mt-16 animate-fadeInUp">
            <Button
              onClick={() => setShowFinalChallenge(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
            >
              <Sparkles className="mr-2" /> Compléter l'Escape Game
            </Button>
          </div>
        )}

        {/* Non terminées */}
        {lockedWonders.length > 0 && (
          <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Non terminées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lockedWonders.map((wonder) => (
                <WonderCard key={wonder.id} wonder={{ ...wonder, status: "locked" }} />
              ))}
            </div>
          </div>
        )}

        {/* Terminées */}
        {completedWonders.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Terminées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedWonders.map((wonder) => (
                <WonderCard key={wonder.id} wonder={{ ...wonder, status: "completed" }} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
