export interface CartItemPayload {
  productId: string
  quantity: number
}

const API_URL = "http://ec2-54-234-196-249.compute-1.amazonaws.com/orders"


export const createOrder = async (items: CartItemPayload[], token: string) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Erro ao criar pedido")
    }

    return data

  } catch (err: any) {
    console.error("Erro no createOrder:", err.message)
    throw err
  }
}

export const getUserOrders = async (token: string) => {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Erro ao buscar pedidos")
    }

    return data

  } catch (err: any) {
    console.error("Erro no getUserOrders:", err.message)
    throw err
  }
}

export const deleteOrder = async (orderId: string, token: string) => {
  try {
    const res = await fetch(`${API_URL}/${orderId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Erro ao deletar pedido")
    }

    return data

  } catch (err: any) {
    console.error("Erro no deleteOrder:", err.message)
    throw err
  }
}
