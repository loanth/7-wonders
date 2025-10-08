// Ce fichier est désormais déplacé dans /accueil/intro/page.tsx pour la route Next.js. Vous pouvez le supprimer.

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
		<div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/80 via-background to-secondary/80 overflow-hidden">
			{/* Fond animé */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
				<div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-70 blur-sm">
					<SplineBg />
				</div>
			</div>
			{/* Card centrale avec dialogue */}
			<Card className={cn("relative z-10 w-full max-w-xl mx-auto bg-card/95 shadow-2xl border border-border p-10 flex flex-col items-center backdrop-blur-md transition-all duration-300", "rounded-3xl")}>
				<div className="flex items-center mb-8">
					<Image
						src={current.avatar}
						alt={current.speaker}
						width={72}
						height={72}
						className="rounded-full border-4 border-primary/80 shadow-lg mr-6 bg-background"
					/>
					<span className="font-extrabold text-2xl text-primary drop-shadow-sm tracking-wide">
						{current.speaker}
					</span>
				</div>
				<div className="bg-muted/60 rounded-xl p-6 text-lg text-foreground mb-10 whitespace-pre-line min-h-[90px] shadow-inner border border-muted-foreground/10">
					{current.text}
				</div>
				<Button
					size="lg"
					className="text-lg px-10 py-4 font-bold rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:scale-105 transition-transform"
					onClick={handleNext}
				>
					{step < dialogue.length - 1 ? "Suivant" : "Explorer la planète"}
				</Button>
			</Card>
		</div>
	)
}
