'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">Bem-vindo à Brillare ✨</h1>
        <p className="text-muted-foreground">Você está logado com sucesso!</p>
      </div>
    </main>
  )
}
