import React from "react"
import FixedMenu from "@/components/FixedMenu"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center text-primary">
        <FixedMenu/>
      <div className="max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-4">Sobre a Brillare</h1>
        <p className="text-lg leading-relaxed">
          A <strong>Brillare</strong> nasceu com o propósito de destacar a beleza e elegância por meio de joias exclusivas. 
          Fundada em 2025 como um projeto acadêmico, nos inspiramos nas tendências do mercado de luxo para oferecer uma experiência única ao usuário.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Nosso catálogo é composto por anéis, colares, pulseiras e brincos cuidadosamente selecionados, com foco em design moderno e sofisticação. 
          Cada peça reflete brilho, estilo e personalidade.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Mais do que uma loja, queremos que a Brillare represente a confiança, o bom gosto e a jornada de quem valoriza os detalhes.
        </p>
      </div>
    </div>
  )
}
