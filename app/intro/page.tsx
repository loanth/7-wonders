"use client"

import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SplineBg = dynamic(() => import('@/components/SplineScene'), { ssr: false, loading: () => <div className="w-full h-full" /> })

export default function IntroPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Terre animée en fond */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] opacity-60">
          <SplineBg />
        </div>
      </div>
      {/* Card centrale */}
      <Card className="relative z-10 w-full max-w-xl mx-auto bg-card/90 shadow-2xl border border-border">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary text-center">
            Bienvenue dans l’aventure des 7 Merveilles du Monde !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground text-center">
          <p>
            Prépare-toi à voyager à travers l’histoire et les cultures du monde en résolvant des énigmes autour des 7 Merveilles.
            À chaque étape, tu découvriras une merveille, relèveras un défi, et obtiendras une lettre.
          </p>
          <p>
            Une fois toutes les énigmes résolues, tu révéleras un mot mystère, symbole d’une valeur universelle.
          </p>
          <div className="bg-muted/30 rounded-lg p-4 text-left text-base">
            <strong>Règles du jeu :</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Explore la planète et clique sur les 7 merveilles.</li>
              <li>Lis la présentation, puis résous l’énigme proposée.</li>
              <li>À chaque énigme réussie, une lettre te sera révélée.</li>
              <li>Réunis les 7 lettres pour découvrir le mot secret final !</li>
            </ul>
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/">
              <Button size="lg" className="text-lg px-8 py-4 font-bold">
                Commencer l’aventure
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
