'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { supabase } from "@/services/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw new Error(error.message)

      if (data.session) {
        localStorage.setItem("token", data.session.access_token)
        router.push("/home")
      } else {
        throw new Error("Login falhou. Tente novamente.")
      }

    } catch (err: any) {
      alert(err.message || "Erro ao fazer login")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary text-center">Brillare</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-1">
              <Label htmlFor="email" className="text-primary">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-primary"
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password" className="text-primary">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-primary"
              />
            </div>

            <Button type="submit" className="mt-4 w-full">
              Entrar
            </Button>
            <p className="text-sm text-center">
              Não tem conta? <a href="/register" className="text-primary underline">Cadastre-se</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
