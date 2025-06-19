'use client'

import { useRouter } from "next/navigation"

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
}

export default function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
  const router = useRouter()

  return (
    <div 
      onClick={() => router.push(`/products/${id}`)}
      className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full"
    >
      <div className="w-full aspect-square bg-gray-100">
        <img 
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain p-2"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <h3 className="font-semibold text-base line-clamp-2">{name}</h3>
        <p className="text-primary font-bold mt-2">R$ {price.toFixed(2)}</p>
      </div>
    </div>
  )
}
