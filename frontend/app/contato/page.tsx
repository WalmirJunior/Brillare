import React from "react"
import FixedMenu from "@/components/FixedMenu"

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center text-primary">
        <FixedMenu/>
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Fale Conosco</h1>
        <p className="text-lg mb-6">
          Quer saber mais sobre a Brillare ou entrar em contato com os desenvolvedores? Veja abaixo nossos links:
        </p>
        <ul className="space-y-4 text-lg">
          <li>
            <a
              href="https://github.com/walmirjunior"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              GitHub - Walmir Machado
            </a>
          </li>
          <li>
            <a
              href="https://github.com/brenscf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              GitHub - Brenda Machado
            </a>
          </li>
          <li>
            <a
              href="https://github.com/ZDavidXros"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              GitHub - David Santos
            </a>
          </li>

        </ul>
      </div>
    </div>
  )
}
