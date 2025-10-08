"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Perdu() {
  const router = useRouter()

  useEffect(() => {
    // 💣 On nettoie tout dès qu’on arrive sur la page
    localStorage.clear()
  }, [])

  const handleRestart = () => {
    // 👀 On refait un petit clear pour être sûr
    localStorage.clear()
    router.push("/")
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden text-white">
      {/* 🌌 Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-red-900 animate-pulse opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,0,128,0.3),_transparent_60%)] blur-3xl"></div>
      
      {/* 💥 Effet glitch */}
      <h1 className="relative z-10 text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-red-500 to-orange-600 animate-pulse select-none tracking-wider">
        💀 PERDU 💀
      </h1>

      <p className="relative z-10 mt-6 text-lg md:text-xl text-gray-300 text-center max-w-xl">
        Le temps est écoulé... les mystères resteront non résolus.  
        <span className="block text-purple-400 mt-2 italic">La prochaine fois, sois plus rapide.</span>
      </p>

      {/* 🔘 Bouton retour */}
      <button
        onClick={handleRestart}
        className="relative z-10 mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-800/40 hover:shadow-purple-500/60 hover:scale-105"
      >
        🔄 Revenir à l’accueil
      </button>

      {/* 🌠 Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-1 h-1 bg-purple-400 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* 🎞️ Styles d’animation custom */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}
