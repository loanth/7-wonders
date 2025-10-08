"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface TimerContextType {
  timeLeft: number
  formatTime: (sec: number) => string
}

const TimerContext = createContext<TimerContextType | null>(null)

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 min = 2700 sec

  useEffect(() => {
    const storedStart = localStorage.getItem("timerStart")
    let startTime: number

    if (storedStart) {
      startTime = parseInt(storedStart)
    } else {
      startTime = Date.now()
      localStorage.setItem("timerStart", startTime.toString())
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = 45 * 60 - elapsed

      if (remaining <= 0) {
        localStorage.removeItem("timerStart")
        clearInterval(interval)
        router.push("/perdu")
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <TimerContext.Provider value={{ timeLeft, formatTime }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = () => {
  const context = useContext(TimerContext)
  if (!context) throw new Error("useTimer doit être utilisé dans <TimerProvider>")
  return context
}
