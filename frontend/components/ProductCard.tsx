'use client'

import { useRouter } from "next/navigation"

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/products/${id}`)
  }

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer p-4 border rounded-lg shadow bg-white hover:shadow-lg transition-shadow duration-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <img src={imageUrl} alt={name} className="w-auto h-48 object-cover rounded" />
      <strong className="block mt-2 text-lg">{name}</strong>
      <span className="text-muted-foreground block">Preço: R${price.toFixed(2)}</span>
    </div>
  )
}

export default ProductCard
