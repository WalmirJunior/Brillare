'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/services/supabaseClient"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 1. Cria o usuário no auth.users
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // armazena em user_metadata
        },
      })

      if (error) throw new Error(error.message)

      const user = data.user
      if (!user) throw new Error("Não foi possível registrar o usuário.")

      // 2. Cria registro complementar na tabela pública `users`
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            name,
            email,
            role: 'user', // ou outro valor padrão
          }
        ])

      if (userError) throw new Error(userError.message)

      alert("Cadastro feito com sucesso! Verifique seu email para confirmar.")
      router.push("/login")
    } catch (err: any) {
      alert(err.message || "Erro ao registrar")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary text-center">Cadastrar na Brillare</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex text-primary flex-col gap-4">
            <div className="grid gap-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="mt-4 w-full">
              Registrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
