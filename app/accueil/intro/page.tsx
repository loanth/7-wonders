"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const SplineBg = dynamic(() => import("@/components/SplineScene"), { ssr: false, loading: () => <div className="w-full h-full" /> })

const dialogue = [
  {
    speaker: "Guide",
    avatar: "/placeholder-user.jpg", // À remplacer par un avatar personnalisé si besoin
    text: "Bienvenue, jeune explorateur ! Je suis ton guide pour ce voyage extraordinaire autour des 7 Merveilles du Monde.",
  },
  {
    speaker: "Guide",
    avatar: "/placeholder-user.jpg",
    text: "À chaque étape, tu découvriras une merveille, relèveras un défi, et obtiendras une lettre secrète.",
  },
  {
    speaker: "Guide",
    avatar: "/placeholder-user.jpg",
    text: "Réunis les 7 lettres pour révéler un mot mystère, symbole d’une valeur universelle. Es-tu prêt à relever le défi ?",
  },
  {
    speaker: "Guide",
    avatar: "/placeholder-user.jpg",
    text: "Voici comment l’aventure se déroule :\n- Explore la planète et clique sur les 7 merveilles.\n- Lis la présentation, puis résous l’énigme proposée.\n- À chaque énigme réussie, une lettre te sera révélée.\n- Réunis les 7 lettres pour découvrir le mot secret final !",
  },
]

export default function AccueilIntro() {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const current = dialogue[step]

  const handleNext = () => {
    if (step < dialogue.length - 1) {
      setStep(step + 1)
    } else {
      router.push("/accueil")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-60">
          <SplineBg />
        </div>
      </div>
      {/* Card centrale avec dialogue */}
      <Card className="relative z-10 w-full max-w-lg mx-auto bg-card/90 shadow-2xl border border-border p-8 flex flex-col items-center">
        <div className="flex items-center mb-6">
          <Image src={current.avatar} alt={current.speaker} width={64} height={64} className="rounded-full border-2 border-primary mr-4" />
          <span className="font-bold text-lg text-primary">{current.speaker}</span>
        </div>
        <div className="bg-muted/40 rounded-lg p-4 text-base text-foreground mb-8 whitespace-pre-line min-h-[80px]">
          {current.text}
        </div>
        <Button size="lg" className="text-lg px-8 py-4 font-bold" onClick={handleNext}>
          {step < dialogue.length - 1 ? "Suivant" : "Explorer la planète"}
        </Button>
      </Card>
    </div>
  )
}

