"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SplineScene from "@/components/SplineScene"
import { WonderCard } from "@/components/wonder-card"
import { wonders } from "@/lib/wonders"

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const wonderId = searchParams.get("id")

  const selectedWonder = wonderId
    ? wonders.find((w) => w.id === Number.parseInt(wonderId))
    : null

  const [partieData, setPartieData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 🕒 TIMER PERSISTANT 45 min (en secondes)
  const [timeLeft, setTimeLeft] = useState(45 * 60)

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
      const remaining = 45 * 60 - elapsedSeconds // ⏱️ 45 min = 2700s

      if (remaining <= 0) {
        setTimeLeft(0)
        localStorage.removeItem("timerStart")
        router.push("/perdu") // 🚨 Redirection quand le temps est écoulé
      } else {
        setTimeLeft(remaining)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [router])

  // format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

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
    ? wonders.filter((w) => {
        const key = `m${w.id}`
        return partieData[key] === 0
      })
    : []

  const completedWonders = partieData
    ? wonders.filter((w) => {
        const key = `m${w.id}`
        return partieData[key] === 1
      })
    : []

  if (loading) {
    return <div className="text-white text-center mt-20">Chargement...</div>
  }

  return (
    <main className="min-h-screen w-full bg-black text-white overflow-y-auto relative">
      {/* 🌈 Fonds animés */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none" />

      {/* ⏱️ TIMER FIXÉ EN HAUT */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/70 backdrop-blur-md border border-purple-500/40 text-purple-300 px-6 py-2 rounded-full shadow-lg shadow-purple-900/30 font-mono text-lg">
        ⏱️ {formatTime(timeLeft)}
      </div>

      <section className="relative h-[75vh] flex">
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
        {/* 🔐 Locked wonders */}
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
                <div
                  key={wonder.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <WonderCard
                    wonder={{
                      ...wonder,
                      status:
                        partieData[`m${wonder.id}`] === 1
                          ? "completed"
                          : "locked",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Completed wonders */}
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
                <div
                  key={wonder.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <WonderCard
                    wonder={{
                      ...wonder,
                      status:
                        partieData[`m${wonder.id}`] === 1
                          ? "completed"
                          : "locked",
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
