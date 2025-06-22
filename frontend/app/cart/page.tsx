'use client'

import { useState, useEffect } from "react"
import { createOrder, getUserOrders } from "@/services/orderService"
import { useCart } from "@/app/context/CartContext"
import FixedMenu from "@/components/FixedMenu"

interface Order {
  id: string
  items: {
    productId: string
    quantity: number
    price?: number
  }[]
  created_At: string
  status: string
}

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [showOrders, setShowOrders] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    if (showOrders) {
      loadUserOrders()
    }
    loadUserCredits()
  }, [showOrders])

  const loadUserOrders = async () => {
    try {
      const token = localStorage.getItem("token") || ""
      if (!token) {
        console.warn("Token não encontrado. Usuário não autenticado.")
        return
      }

      const userOrders = await getUserOrders(token)
      const normalizedOrders = (userOrders || []).map((order: any) => ({
        ...order,
        items: order.items.map((item: any) => ({
          productId: item.product_id || item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }))

      console.log("Pedidos normalizados:", normalizedOrders)
      setOrders(normalizedOrders)
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err)
      alert("Erro ao carregar pedidos")
    }
  }

  const loadUserCredits = async () => {
    try {
      const token = localStorage.getItem("token") || ""
      if (!token) return

      const response = await fetch("http://ec2-54-234-196-249.compute-1.amazonaws.com/credits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error("Erro ao buscar créditos")

      const data = await response.json()
      console.log(data)
      setCredits(data.balance)
    } catch (err) {
      console.error("Erro ao carregar créditos:", err)
      setCredits(null)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
      localStorage.removeItem('cart')
      window.location.reload()
    } catch (err: any) {
      alert(err.message || "Erro ao criar pedido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-background">
      <FixedMenu/>
      <h1 className="text-2xl font-bold my-10">Seu Carrinho</h1>

      {credits !== null && (
        <p className="mb-6 text-primary font-semibold">
          Créditos disponíveis: R$ {credits.toFixed(2)}
        </p>
      )}

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
              {orders.map(order => {
                const orderTotal = order.items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
                return (
                  <div key={order.id} className="border rounded p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Pedido #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Data: {order.created_At ? new Date(order.created_At).toLocaleDateString() : '--'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: {order.status}
                        </p>
                      </div>
                      <p className="font-bold">
                        Total: R$ {orderTotal.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-3 border-t pt-3">
                      <h3 className="font-medium mb-2">Itens:</h3>
                      {order.items.map(item => (
                        <div key={item.productId} className="flex justify-between py-1">
                          <span>{item.productId ? `Produto ${item.productId.substring(0, 6)}...` : 'Produto indefinido'}</span>
                          <span>
                            {item.quantity} x R$ {item.price !== undefined ? item.price.toFixed(2) : '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
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
                    <p className="text-sm text-muted-foreground">
                      R$ {item.price !== undefined ? item.price.toFixed(2) : '--'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Qtd: {item.quantity}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="font-bold w-20 text-right">
                    R$ {(item.price && item.quantity) ? (item.price * item.quantity).toFixed(2) : '--'}
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 flex justify-between items-center">
                <p className="text-lg font-bold">Total:</p>
                <p className="text-lg font-bold">
                  R$ {total ? total.toFixed(2) : '--'}
                </p>
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
