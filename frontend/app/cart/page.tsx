'use client'

import { useState, useEffect } from "react"
import { createOrder, getUserOrders } from "@/services/orderService"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface Order {
  id: string
  items: {
    productId: string
    quantity: number
    name?: string
    price?: number
  }[]
  total: number
  createdAt: string
  status: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [showOrders, setShowOrders] = useState(false)

  useEffect(() => {
    // Carrega itens do carrinho do localStorage (opcional)
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    } 
    loadUserOrders()
  }, [])

  const loadUserOrders = async () => {
    try {
      const token = localStorage.getItem("token") || ""
      if (token) {
        const userOrders = await getUserOrders(token)
        setOrders(userOrders)
      }
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateQuantity = (id: string, quantity: number) => {
    const newItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
    setCartItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
  }

  const removeItem = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id)
    setCartItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
  }

  const finalizePurchase = async () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio.")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token") || ""
      const payload = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))

      const res = await createOrder(payload, token)
      alert(`Pedido criado com sucesso! ID: ${res.orderId}`)
      setCartItems([])
      localStorage.removeItem('cart')
      
      // Atualiza a lista de pedidos após criar um novo
      await loadUserOrders()
    } catch (err: any) {
      alert(err.message || "Erro ao criar pedido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-background">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
      
      <button 
        onClick={() => setShowOrders(!showOrders)}
        className="mb-4 text-primary hover:underline"
      >
        {showOrders ? 'Voltar para o Carrinho' : 'Ver Meus Pedidos'}
      </button>

      {showOrders ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Meus Pedidos</h2>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">Você não possui pedidos.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Pedido #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Data: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {order.status}
                      </p>
                    </div>
                    <p className="font-bold">Total: R$ {order.total.toFixed(2)}</p>
                  </div>
                  
                  <div className="mt-3 border-t pt-3">
                    <h3 className="font-medium mb-2">Itens:</h3>
                    {order.items.map(item => (
                      <div key={item.productId} className="flex justify-between py-1">
                        <span>{item.name || `Produto ${item.productId}`}</span>
                        <span>{item.quantity} x R$ {item.price?.toFixed(2) || '--'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 border rounded p-4 shadow-sm">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="font-bold w-20 text-right">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 flex justify-between items-center">
                <p className="text-lg font-bold">Total:</p>
                <p className="text-lg font-bold">R$ {total.toFixed(2)}</p>
              </div>

              <button
                onClick={finalizePurchase}
                disabled={loading}
                className={`w-full py-2 rounded transition ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {loading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}