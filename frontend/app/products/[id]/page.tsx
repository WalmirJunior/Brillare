'use client'

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProductById } from "@/services/productService"
import { useCart } from "../../context/CartContext"
import Breadcrumb from "@/components/Breadcrumb"
import Gallery from "@/components/GalleryProps"

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string  
  categoryName?: string
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const params = useParams()
  const { addToCart } = useCart()
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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.image_url
    })
    alert("Produto adicionado ao carrinho!")
  }

  return (
    <main className="min-h-screen p-6 bg-background">
      <Breadcrumb 
        categoryName={product.categoryName}
        productName={product.name}
      />
      <div>
        <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
        {product.description && (
          <p className="text-sm">{product.description}</p>
        )}
        <div className="flex">
          <div className="max-w-lg w-full bg-white rounded-lg shadow p-6 space-y-4">
            <Gallery
              images={[
                "/images/products/ourobranco.jpg",
                "/images/products/ourobranco2.jpg",
                "/images/products/ourobranco3.jpg",
              ]}
            />
          </div>
          <div className="p-4 space-y-4">
            <p className="text-lg font-bold">R$ {product.price}</p>
            <div className="flex items-center gap-2">
              <label htmlFor="quantity">Qtd:</label>
              <input 
                id="quantity"
                type="number" 
                min={1} 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-16 border rounded px-2 py-1"
              />
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
