"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="m-4">Menu</Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-white shadow-lg">
        <nav className="flex flex-col gap-4 mt-8">
          <a href="/categoria/joias" className="hover:underline">Jóias</a>
          <a href="/categoria/colares" className="hover:underline">Colares</a>
          <a href="/categoria/aneis" className="hover:underline">Anéis</a>
          <a href="/categoria/brincos" className="hover:underline">Brincos</a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
