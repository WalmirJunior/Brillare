'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllProducts } from "@/services/productService"
import Carousel from "@/components/Carousel"
import ProductCard from "@/components/ProductCard"

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

  const carouselImages = [
    "images/banner1.png",
    "images/banner2.jpg",
    "images/banner3.jpg"
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background ">
      <div className="w-full mt-2 mb-8">
        <Carousel images={carouselImages} />
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mx-5 mb-3">Produtos disponíveis:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {products.map((product) => (
    <li key={product.id}>
      <ProductCard
        id={product.id}
        name={product.name}
        price={product.price}
        imageUrl={"/images/products/ourobranco.jpg" }
      />
    </li>
  ))}
</ul>
      </div>
    </main>
  )
}
