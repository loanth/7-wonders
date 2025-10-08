"use client"

import { useEffect, useState } from "react"
import SplineScene from "@/components/SplineScene"
import { useSearchParams, useRouter } from "next/navigation"
import { WonderCard } from "@/components/wonder-card"
import { wonders } from "@/lib/wonders"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

  // 🔄 Fetch de la partie associée à l'utilisateur
  useEffect(() => {
    const fetchPartie = async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      try {
        const res = await fetch(`/api/partie?userId=${userId}`)
        const data = await res.json()
        if (res.ok) setPartieData(data.partie)
      } catch (err) {
        console.error("Erreur lors du fetch de la partie:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartie()
  }, [])

  // 🔐 Détermination des wonders bloquées / complétées
  const lockedWonders = partieData
    ? wonders.filter((w) => partieData[`m${w.id}`] === 0)
    : []

  const completedWonders = partieData
    ? wonders.filter((w) => partieData[`m${w.id}`] === 1)
    : []

  // ✅ Vérifie si toutes les merveilles sont complètes
  const allCompleted =
    partieData &&
    ["m1", "m2", "m3", "m4", "m5", "m6", "m7"].every((key) => partieData[key] === 1)

  // 🧩 Ordre fixe des lettres du mot “CULTURE” (pas évident mais toujours le même)
  useEffect(() => {
    const fixedOrder = ["R", "T", "E", "U", "L", "C", "U"] // RTEULCU
    setLetters(fixedOrder)
  }, [showFinalChallenge])

  // 🔁 Fonction de permutation des lettres
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return
    const updated = [...letters]
    const [moved] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, moved)
    setLetters(updated)
    setDraggedIndex(null)
  }

  // ✅ Vérifie si le mot est bon
  const checkIfCorrect = () => {
    if (letters.join("") === "CULTURE") {
      setIsCompleted(true)
    } else {
      alert("Pas encore... essaie une autre combinaison !")
    }
  }

  if (loading) {
    return <div className="text-white text-center mt-20">Chargement...</div>
  }

  // 🎉 Écran final de félicitations
  if (isCompleted) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 text-center">
          Félicitations !
        </h1>
        <p className="text-lg text-gray-300 mb-10 text-center max-w-md">
          Tu as retrouvé la <span className="text-purple-400 font-semibold">Clé des Civilisations</span> !
          Ton voyage à travers les Merveilles touche à sa fin...
        </p>
        <Button
          onClick={() => router.push("../")}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-transform"
        >
          Retour à la connexion
        </Button>
      </main>
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

  // 🌍 Page principale classique
  return (
    <main className="min-h-screen w-full bg-black text-white overflow-y-auto relative">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none" />

      <section className="relative h-[75vh] flex">
        {/* 3D Model */}
        <div className="w-full h-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500 pointer-events-none z-10" />
          <SplineScene />
        </div>

        {selectedWonder && (
          <div className="md:block overflow-hidden h-full bg-zinc-900/40 backdrop-blur-xl border-l border-purple-500/30 p-6 shadow-2xl shadow-purple-500/20 animate-fadeInUp">
            <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 overflow-hidden">
              <WonderCard wonder={selectedWonder} />
            </div>
          </div>
        )}
      </section>

      <section className="relative z-10 px-4 py-16 bg-gradient-to-b from-black via-zinc-950 to-black">
        {lockedWonders.length > 0 && (
          <div className="max-w-7xl mx-auto mb-20">
            <h3>Cliquez sur les pins du globe pour explorer les merveilles.</h3>
            <div className="flex items-center gap-3 mb-10 animate-fadeInUp">
              <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                À découvrir
              </h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-orange-500/50 to-transparent rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lockedWonders.map((wonder, index) => (
                <div key={wonder.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <WonderCard
                    wonder={{
                      ...wonder,
                      status: partieData[`m${wonder.id}`] === 1 ? "completed" : "locked",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🏁 Bouton final */}
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

        {completedWonders.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10 animate-fadeInUp">
              <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Terminé
              </h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedWonders.map((wonder, index) => (
                <div key={wonder.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  <WonderCard
                    wonder={{
                      ...wonder,
                      status: partieData[`m${wonder.id}`] === 1 ? "completed" : "locked",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        
      </section>
    </main>
  )
}
