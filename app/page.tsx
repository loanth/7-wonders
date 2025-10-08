"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  // --- Parties publiques (consultation) ---
  type PublicPartie = {
    id: number
    players: number
    progress: number // 0..100
    created_at: string
  }

  const [openPublic, setOpenPublic] = useState(false)
  const [publicLoading, setPublicLoading] = useState(false)
  const [publicError, setPublicError] = useState<string | null>(null)
  const [publicParties, setPublicParties] = useState<PublicPartie[]>([])

  const controller = useMemo(() => new AbortController(), [openPublic])

  // Rejoindre une partie publique avec le pseudo saisi
  const [joinLoadingId, setJoinLoadingId] = useState<number | null>(null)
  const handleJoinPartie = async (partieId: number) => {
    const name = pseudo.trim()
    if (!name) {
      alert("Veuillez entrer un pseudo pour rejoindre une partie")
      return
    }
    setJoinLoadingId(partieId)
    try {
      const res = await fetch(`/api/partie/${partieId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: name }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || "Erreur lors de la connexion à la partie")
        return
      }
      localStorage.setItem("partieId", String(data.partieId))
      localStorage.setItem("userId", String(data.userId))
      localStorage.setItem("pseudo", name)
      router.push("/accueil")
    } catch (e) {
      console.error("Erreur lors de la jointure:", e)
      alert("Erreur de connexion au serveur")
    } finally {
      setJoinLoadingId(null)
    }
  }

  const fetchPublicParties = async () => {
    setPublicError(null)
    setPublicLoading(true)
    try {
      const res = await fetch(`/api/partie/public?limit=50`, { signal: controller.signal })
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as any))
        throw new Error(data?.error || `Erreur ${res.status}`)
      }
      const data = await res.json()
      setPublicParties(Array.isArray(data.parties) ? data.parties : [])
    } catch (e: any) {
      if (e?.name !== "AbortError") setPublicError(e?.message || "Erreur inconnue")
    } finally {
      setPublicLoading(false)
    }
  }

  useEffect(() => {
    if (openPublic) {
      setPublicParties((prev) => prev)
      fetchPublicParties()
      return () => controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPublic])

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleString()
    } catch {
      return dateStr
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Fond 3D Terre qui tourne */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-full animate-spin"
            style={{
              animationDuration: '120s',
              animationTimingFunction: 'linear',
              animationPlayState: openPublic ? 'paused' as const : 'running' as const,
            }}
          >
            {!openPublic && (
              <SplineBg className="transform-gpu origin-center scale-[1.8] -translate-x-[5%]" />
            )}
          </div>
        </div>
        {/* Voiles de dégradés pour harmoniser avec l'app */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent pointer-events-none" />
        <div className={`absolute inset-0 pointer-events-none ${openPublic ? '' : 'backdrop-blur-[1px]'}`} />
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

              <div className="space-y-3">
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" disabled={loading || !pseudo.trim()}>
                  {loading ? "Création..." : "Créer la partie"}
                </Button>

                {/* Bouton pour consulter les parties en cours */}
                <Dialog open={openPublic} onOpenChange={setOpenPublic}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/10">
                      Voir les parties en cours
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl bg-zinc-950 border border-purple-500/30 text-zinc-100">
                    <DialogHeader>
                      <DialogTitle className="text-lg">Parties publiques en cours</DialogTitle>
                      <DialogDescription className="text-zinc-400">
                        Consultez les parties multijoueurs non terminées. Cette vue est en lecture seule.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center justify-between gap-3 pb-2">
                      <span className="text-sm text-zinc-400">Dernières parties (max 50)</span>
                      <Button size="sm" variant="ghost" className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10" onClick={fetchPublicParties} disabled={publicLoading}>
                        {publicLoading ? "Chargement..." : "Actualiser"}
                      </Button>
                    </div>

                    {publicError && (
                      <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-md p-2">
                        {publicError}
                      </div>
                    )}

                    <TooltipProvider>
                      <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40">
                        <ScrollArea className="h-[60vh]">
                          <div className="divide-y divide-zinc-800/60">
                            {publicLoading && publicParties.length === 0 && (
                              <div className="p-6 text-center text-zinc-400">Chargement des parties...</div>
                            )}

                            {!publicLoading && publicParties.length === 0 && !publicError && (
                              <div className="p-6 text-center text-zinc-400">Aucune partie publique en cours pour le moment.</div>
                            )}

                            {publicParties.map((p) => (
                              <div key={p.id} className="p-4 flex flex-col gap-2 hover:bg-zinc-900/40 transition-colors">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-zinc-300">
                                    <span className="text-zinc-400">Partie</span> #{p.id}
                                  </div>
                                  <div className="text-xs text-zinc-400">Créée le {formatDate(p.created_at)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-sm text-zinc-300 min-w-[110px]">Joueurs: <span className="text-purple-300 font-medium">{p.players}</span></div>
                                  <div className="flex-1">
                                    <Progress value={p.progress} className="h-2 bg-zinc-800" />
                                    <div className="text-[11px] text-right mt-1 text-zinc-400">{p.progress}%</div>
                                  </div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex">
                                        <Button
                                          size="sm"
                                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                                          onClick={() => handleJoinPartie(p.id)}
                                          disabled={joinLoadingId === p.id || !pseudo.trim()}
                                        >
                                          {joinLoadingId === p.id ? "Connexion..." : "Rejoindre"}
                                        </Button>
                                      </span>
                                    </TooltipTrigger>
                                    {!pseudo.trim() && (
                                      <TooltipContent side="top">
                                        Entrez un pseudo avant de rejoindre
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </TooltipProvider>

                    <div className="pt-2 text-xs text-zinc-500">
                      Astuce: Créez une partie en mode multijoueur pour qu'elle apparaisse ici.
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
