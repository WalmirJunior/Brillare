'use client'

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProductById } from "@/services/productService"
import Breadcrumb from "@/components/Breadcrumb"

interface Product {
  id: string
  name: string
  price: number
  description?: string
  imageUrl?: string
  categoryName?: string
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    getProductById(id, token)
      .then(res => setProduct(res))
      .catch(err => {
        console.error("Erro ao buscar produto:", err)
        alert("Erro ao buscar produto: " + err.message)
      })
  }, [id])

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando produto...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-background">
            <Breadcrumb 
                categoryName={product.categoryName}
                productName={product.name}
            />

      <div className="max-w-lg w-full bg-white rounded-lg shadow p-6 space-y-4">
        {product.imageUrl && (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover rounded" 
          />
        )}
        <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
        <p className="text-lg text-muted-foreground">Preço: R${product.price}</p>
        {product.description && (
          <p className="text-sm">{product.description}</p>
        )}
      </div>
    </main>
  )
}
