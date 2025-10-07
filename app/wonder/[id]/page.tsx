import { getWonderById, wonders } from "@/lib/wonders"
import { WonderCard } from "@/components/wonder-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface WonderPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return wonders.map((wonder) => ({
    id: wonder.id.toString(),
  }))
}

export default async function WonderPage({ params }: WonderPageProps) {
  const { id } = await params
  const wonderId = Number.parseInt(id)

  if (isNaN(wonderId) || wonderId < 1 || wonderId > 7) {
    notFound()
  }

  const wonder = getWonderById(wonderId)

  if (!wonder) {
    notFound()
  }

  const prevId = wonderId > 1 ? wonderId - 1 : null
  const nextId = wonderId < 7 ? wonderId + 1 : null

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Merveille</span>
            <span className="text-lg font-bold text-primary">{wonderId} / 7</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <WonderCard wonder={wonder} />

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {prevId ? (
              <Button asChild variant="outline" size="lg">
                <Link href={`/wonder/${prevId}`} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {nextId && (
              <Button asChild size="lg">
                <Link href={`/wonder/${nextId}`} className="flex items-center gap-2">
                  Suivant
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </Button>
            )}
          </div>

          {/* Progress Grid */}
          <div className="pt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">Progression</h3>
            <div className="grid grid-cols-7 gap-3">
              {wonders.map((w) => (
                <Link
                  key={w.id}
                  href={`/wonder/${w.id}`}
                  className={`aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-bold text-lg ${
                    w.id === wonderId
                      ? "bg-primary text-primary-foreground border-primary scale-110"
                      : "bg-card border-border hover:border-primary hover:bg-primary/10"
                  }`}
                >
                  {w.id}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
