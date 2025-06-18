'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, ShoppingCart, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function FixedMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const goToCart = () => {
    router.push("/cart")
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-background shadow z-50 flex justify-between items-center p-4">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button>
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            <ul className="space-y-2">
              <li><a href="/home" className="hover:underline">Home</a></li>
              <li><a href="/produtos" className="hover:underline">Produtos</a></li>
              <li><a href="/sobre" className="hover:underline">Sobre</a></li>
              <li><a href="/contato" className="hover:underline">Contato</a></li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
      <div className="text-xl font-bold">Brillare</div>
      <div className="flex items-center gap-4">
        <button>
          <User className="w-6 h-6" />
        </button>
        <button onClick={goToCart}>
          <ShoppingCart className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
