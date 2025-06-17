'use client'

import Link from 'next/link'

interface BreadcrumbProps {
  categoryName: string
  productName: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ categoryName, productName }) => {
  return (
    <nav className="text-sm text-muted-foreground mb-4">
      <ul className="flex flex-wrap items-center space-x-2">
        <li>
          <Link href="/products" className="hover:underline text-primary">
            Jóias
          </Link>
          <span>/</span>
        </li>
        <li>
          <Link href={`/products?category=${encodeURIComponent(categoryName)}`} className="hover:underline text-primary">
            {categoryName}
          </Link>
          <span>/</span>
        </li>
        <li className="text-foreground">{productName}</li>
      </ul>
    </nav>
  )
}

export default Breadcrumb
