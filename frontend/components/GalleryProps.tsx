'use client'

import { useState } from "react"

interface GalleryProps {
  images: string[]
}

export default function Gallery({ images }: GalleryProps) {
  const [mainImage, setMainImage] = useState(images[0])

  return (
    <div className="flex gap-4">
      {/* Imagem destaque */}
      <div className="flex-1">
        <img 
          src={mainImage} 
          alt="Imagem em destaque"
          className="w-full h-96 object-cover rounded-lg shadow"
        />
      </div>

      {/* Miniaturas */}
      <div className="flex flex-col gap-2">
        {images.slice(0, 4).map((img, index) => (
          <button 
            key={index}
            onClick={() => setMainImage(img)}
            className={`border rounded overflow-hidden ${
              mainImage === img ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img 
              src={img} 
              alt={`Miniatura ${index + 1}`} 
              className="w-20 h-20 object-cover"
            />
          </button>
        ))}

        {images.length > 4 && (
          <div className="w-20 h-20 flex items-center justify-center bg-muted rounded text-sm">
            +{images.length - 4}
          </div>
        )}
      </div>
    </div>
  )
}
