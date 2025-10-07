'use client'

import React, { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'
import type { Application } from '@splinetool/runtime'

type SplineSceneProps = {
  className?: string
  rotate?: boolean
  speed?: number // radians per frame
  targetName?: string
}

export default function SplineScene({ className = '', rotate = false, speed = 0.002, targetName }: SplineSceneProps) {
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef<any>(null)
  const appRef = useRef<Application | null>(null)

  const handleLoad = (app: Application) => {
    appRef.current = app
    if (!rotate) return

    const candidates = targetName ? [targetName] : ['Earth', 'Globe', 'World', 'Terre']
    let target: any = null

    for (const n of candidates) {
      try {
        // @ts-ignore runtime exposé dans build
        const found = (app as any).findObjectByName?.(n)
        if (found) {
          target = found
          break
        }
      } catch {}
    }

    // Fallback: parcourir tous les objets et tenter un choix raisonnable
    if (!target) {
      try {
        // @ts-ignore runtime exposé dans build
        const all = (app as any).getAllObjects?.() as any[] | undefined
        if (all && all.length) {
          // Aide au debug: lister quelques noms
          console.log('[Spline] Objets dans la scène:', all.slice(0, 50).map((o) => o?.name || o?.type))
          // Chercher un nom parlant
          target = all.find((o) => /earth|globe|world|terre/i.test(o?.name || ''))
          if (!target) target = all.find((o) => o?.rotation)
          if (!target) target = all[0]
        }
      } catch {}
    }

    if (!target) return

    targetRef.current = target

    const tick = () => {
      if (targetRef.current) {
        try {
          targetRef.current.rotation.y += speed
        } catch {}
      }
      try {
        ;(appRef.current as any)?.requestRender?.()
      } catch {}
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      appRef.current = null
      targetRef.current = null
    }
  }, [])

  return (
    <div className={`w-full h-full ${className}`}>
      <Spline
        scene="https://prod.spline.design/4QZPQMIzrq5KF4cY/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
        onLoad={handleLoad}
      />
    </div>
  )
}