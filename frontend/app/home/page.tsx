'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllProducts } from "@/services/productService"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    getAllProducts(token)
      .then((res) => setProducts(res))
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err)
        alert("Erro ao buscar produtos: " + err.message)
      })
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-primary">Bem-vindo à Brillare ✨</h1>
        <p className="text-muted-foreground">Você está logado com sucesso!</p>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Produtos disponíveis:</h2>
        <ul className="space-y-3">
          {products.map((product, index) => (
            <li key={index} className="p-4 border rounded-lg shadow bg-white">
              <strong className="block text-lg">{product.name}</strong>
              <span className="text-muted-foreground">Preço: R${product.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
