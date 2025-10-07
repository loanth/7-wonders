"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const SplineBg = dynamic(() => import("@/components/SplineScene"), { ssr: false, loading: () => <div className="w-full h-full" /> })

export default function Home() {
  const [pseudo, setPseudo] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreatePartie = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pseudo.trim()) {
      alert("Veuillez entrer un pseudo")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/partie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudo: pseudo.trim(),
          public: isPublic,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("partieId", data.partieId)
        localStorage.setItem("userId", data.userId)
        localStorage.setItem("pseudo", pseudo.trim())
        router.push("/accueil")
      } else {
        alert(data.error || "Erreur lors de la création de la partie")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Fond 3D Terre qui tourne */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full animate-spin" style={{ animationDuration: '120s', animationTimingFunction: 'linear' }}>
            <SplineBg className="transform-gpu origin-center scale-[1.8] -translate-x-[5%]" />
          </div>
        </div>
        {/* Voiles de dégradés pour harmoniser avec l'app */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none" />
      </div>

      {/* Contenu centré */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                7 Wonders – Enigmes
              </span>
            </CardTitle>
            <CardDescription className="text-zinc-300/80">
              Entrez votre pseudo et lancez une partie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePartie} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pseudo">Pseudo</Label>
                <Input
                  id="pseudo"
                  type="text"
                  placeholder="Entrez votre pseudo"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  required
                  maxLength={255}
                  autoFocus
                  className="bg-zinc-900/60 border-zinc-700/60 placeholder:text-zinc-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="public" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked as boolean)} />
                <Label
                  htmlFor="public"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Autoriser le multijoueur
                </Label>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" disabled={loading || !pseudo.trim()}>
                {loading ? "Création..." : "Créer la partie"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
