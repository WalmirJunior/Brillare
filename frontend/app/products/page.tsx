'use client'

import { useEffect, useState } from 'react'
import { getAllProducts } from '@/services/productService'
import ProductCard from '@/components/ProductCard'
import FixedMenu from '@/components/FixedMenu'

interface Product {
  id: string
  name: string
  price: number
  category: string
  imageUrl?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          alert("Você precisa estar logado para ver os produtos.")
          return
        }

        const res = await getAllProducts() as Product[]


        console.log("Produtos carregados:", res)


        const normalized = res.map((p: any) => ({
          ...p,
          price: typeof p.price === 'number' ? p.price : 0,
          imageUrl: p.image_url 
        }))


        setProducts(normalized)
      } catch (err: any) {
        console.error("Erro ao carregar produtos:", err.message || err)
        alert(err.message || "Erro ao carregar produtos")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
    
  }, [])
  const productsByCategory = products.reduce<Record<string, Product[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {})

  return (
    <main className="min-h-screen p-6 bg-background">
        <div className='mb-10'><FixedMenu/></div>
      <h1 className="text-2xl font-bold mb-4">Todos os Produtos</h1>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        Object.entries(productsByCategory).map(([category, items]) => (
          <div key={category} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl || ''}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  )
}
