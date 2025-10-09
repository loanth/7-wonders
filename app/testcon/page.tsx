// pages/test-db.tsx
"use client"
import { useState } from "react"

export default function TestDBPage() {
  const [result, setResult] = useState<string>("")

  const testConnection = async () => {
    try {
      const res = await fetch("/api/test-db")
      const data = await res.json()
      if (res.ok) {
        setResult(`✅ Connexion réussie ! Message : ${data.message}`)
      } else {
        setResult(`❌ Erreur : ${data.error}`)
      }
    } catch (err: any) {
      setResult(`❌ Exception : ${err.message}`)
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Test de connexion à la base MySQL</h1>
      <button onClick={testConnection} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Tester la connexion
      </button>
      {result && <p style={{ marginTop: "1rem" }}>{result}</p>}
    </div>
  )
}
