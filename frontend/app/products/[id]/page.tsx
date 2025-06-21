'use client'

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProductById } from "@/services/productService"
import { useCart } from "../../context/CartContext"
import Breadcrumb from "@/components/Breadcrumb"
import Gallery from "@/components/GalleryProps"
import FixedMenu from "@/components/FixedMenu"

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string  
  image_urls?: string[] 
  categoryName?: string
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const params = useParams()
  const { addToCart, cartItems } = useCart()
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

  // Sincroniza carrinho com localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

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
      imageUrl: product.image_url // Pode usar a principal no carrinho
    })
    alert("Produto adicionado ao carrinho!")
  }

  return (
    <main className="min-h-screen p-6 bg-background">
      <FixedMenu/>
      <Breadcrumb 
        categoryName={product.categoryName}
        productName={product.name}
      />
      <div>
        <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
        {product.description && (
          <p className="text-sm">{product.description}</p>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="max-w-lg w-full bg-white rounded-lg shadow p-6 space-y-4">
            <Gallery
              images={
                product.image_urls && product.image_urls.length > 0
                  ? product.image_urls
                  : [product.image_url || "/images/placeholder.png"]
              }
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
