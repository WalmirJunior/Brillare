'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllProducts } from "@/services/productService"
import Carousel from "@/components/Carousel"
import ProductCard from "@/components/ProductCard"
import Sidebar from "@/components/Sidebar"
import FixedMenu from "@/components/FixedMenu"

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
  getAllProducts()
    .then((res) => setProducts(res as Product[]))
    .catch((err) => {
      console.error("Erro ao buscar produtos:", err)
      alert("Erro ao buscar produtos: " + err.message)
    })
}, [])


  const carouselImages = [
    "images/banner1.png",
    "images/banner2.jpg",
    "images/banner3.jpg"
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background relative">
      <FixedMenu />

      <div className="w-full mb-8">
        <Carousel images={carouselImages} />
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Produtos disponíveis:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={
                  product.image_url 
                    ? product.image_url 
                    : "/images/placeholder.png"
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
