import type { Wonder } from "@/types/wonder"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Lock, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface WonderCardProps {
  wonder: Wonder
}

export function WonderCard({ wonder }: WonderCardProps) {
  const isLocked = wonder.status === "locked"

  return (
    <Card className="group relative overflow-hidden border-2 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-sm border-zinc-800 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/5 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
        <Image
          src={wonder.image || "/placeholder.svg"}
          alt={wonder.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute top-4 right-4 z-20">
          {isLocked && (
            <Badge
              variant="destructive"
              className="bg-red-600/90 text-white border border-red-400/50 shadow-lg shadow-red-500/50 flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            >
              <Lock className="h-3.5 w-3.5 animate-pulse" />
              A faire
            </Badge>
          )}
        </div>
        <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
        </div>
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl text-balance text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
          {wonder.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-base text-zinc-400 group-hover:text-purple-300 transition-colors duration-300">
          <MapPin className="h-4 w-4" />
          {wonder.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <p className="text-zinc-300 leading-relaxed group-hover:text-zinc-200 transition-colors duration-300">
          {wonder.description}
        </p>
      </CardContent>

      <CardFooter className="relative z-10">
        {isLocked && (
          <Button
            asChild
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Link href={`/enigme${wonder.id}`}>
              <Sparkles className="h-4 w-4 mr-2" />
              S&apos;y rendre
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
