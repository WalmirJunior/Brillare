'use client'

import useEmblaCarousel from "embla-carousel-react"

interface CarouselProps {
  images: string[]
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true })

  return (
    <div className="embla overflow-hidden rounded-lg shadow" ref={emblaRef}>
      <div className="embla__container flex">
        {images.map((src, index) => (
          <div
            key={index}
            className="embla__slide flex-[0_0_100%] min-w-0 h-[15.625rem] sm:h-[21.875rem] lg:h-[31.25rem]"
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Carousel
