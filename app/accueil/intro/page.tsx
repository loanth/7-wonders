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
		speaker: "Introduction",
		avatar: "/presentateur.png",
		text: "Mesdames et messieurs, silence...\n\nIci, il ne s'agit pas d'un simple jeu. Tu t'apprêtes à défier les 7 Merveilles du Monde.\n\nMais attention : ce qui t'attend dépasse tout ce que tu imagines.\n\nEs-tu prêt à risquer plus que ta fierté ?",
	},
	{
		speaker: "Introduction",
		avatar: "/presentateur.png",
		text: "À chaque étape : une énigme.\nÀ chaque énigme : une lettre.\n\nMais ne te fais pas d'illusions...\nSeuls les esprits les plus affûtés peuvent espérer avancer.\n\nIci, l'échec n'est pas une option. Il est une certitude pour la plupart...",
	},
	{
		speaker: "Introduction",
		avatar: "/presentateur.png",
		text: "Si, par miracle, tu réunis les 7 lettres...\n\nTu obtiendras la récompense ultime :\nLa clé des civilisations. La connaissance.\n\nMais rares sont ceux qui en sont dignes.\nEs-tu prêt à porter ce fardeau ?",
	},
	{
		speaker: "Introduction",
		avatar: "/presentateur.png",
		text: "Voici les règles, écoute bien :\n\n- Explore la planète, si tu l'oses.\n- Affronte chaque merveille, résous les énigmes.\n- Chaque victoire t'apportera une lettre.\n- Chaque erreur te rapprochera de l'oubli.\n\n7 lettres. Une clé. Un enjeu : la connaissance.\n\nCe n'est pas un jeu, c'est ton destin qui se joue ici.\n\nPrêt à affronter l'inévitable ?",
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
		<main className="min-h-screen w-full bg-black text-white overflow-y-auto relative">
			{/* Overlays dégradés comme la page de connexion */}
			<div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 pointer-events-none z-0" />
			<div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent pointer-events-none z-0" />
			{/* Fond animé Spline */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
				<div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-60">
					<SplineBg />
				</div>
			</div>
			{/* Card centrale avec dialogue, style harmonisé */}
			<section className="relative z-10 flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-3xl mx-auto bg-zinc-900/90 border border-purple-500/40 shadow-2xl shadow-purple-500/20 p-10 flex flex-row items-center rounded-2xl backdrop-blur-md animate-fadeInUp">
					{/* Image du présentateur à gauche, hauteur du bloc texte */}
					<div className="flex-shrink-0 flex items-start h-full pr-8">
						<Image
							src={current.avatar}
							alt={current.speaker}
							width={220}
							height={400}
							className="rounded-2xl border-2 border-purple-500 bg-zinc-800 shadow-lg object-contain h-full max-h-[340px] min-w-[140px]"
							style={{height: '340px', width: 'auto'}}
						/>
					</div>
					{/* Texte et bouton à droite */}
					<div className="flex flex-col flex-1 justify-center h-full">
						<span className="font-bold text-lg text-purple-300 drop-shadow-sm tracking-wide mb-2">
							{current.speaker}
						</span>
						<div className="bg-zinc-800/70 rounded-lg p-6 text-base text-zinc-100 mb-8 whitespace-pre-line min-h-[80px] border border-purple-500/10 shadow-inner w-full leading-relaxed text-lg">
							{current.text}
						</div>
						<Button
							size="lg"
							className="text-lg px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:scale-105 transition-transform border border-purple-500/40"
							onClick={handleNext}
						>
							{step < dialogue.length - 1 ? "Suivant" : "Explorer la planète"}
						</Button>
					</div>
				</Card>
			</section>
		</main>
	)
}
