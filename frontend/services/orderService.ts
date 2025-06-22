import { supabase } from './supabaseClient'

export interface CartItemPayload {
  productId: string
  quantity: number
  price?: number // opcional, pois vamos buscar no Supabase
}

export const createOrder = async (items: CartItemPayload[], userId: string) => {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        status: 'pendente',
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (orderError) {
    console.error('Erro ao criar pedido:', orderError.message)
    throw new Error('Erro ao criar pedido')
  }

  const orderId = orderData.id

  // Buscar preços dos produtos para garantir valores válidos
  const productIds = items.map(item => item.productId)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price')
    .in('id', productIds)

  if (productsError || !products) {
    console.error('Erro ao buscar produtos:', productsError?.message)
    throw new Error('Erro ao buscar preços dos produtos')
  }

  const productPriceMap = new Map(products.map(p => [p.id, p.price]))

  const orderItems = items.map(item => ({
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    price: productPriceMap.get(item.productId) ?? 0
  }))

  const { error: itemError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemError) {
    console.error('Erro ao inserir itens:', itemError.message)
    throw new Error('Erro ao adicionar itens ao pedido')
  }

  return { orderId }
}

export const getUserOrders = async () => {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) throw new Error('Usuário não autenticado')

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      order_items (
        product_id,
        quantity,
        price
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar pedidos:', error.message)
    throw new Error('Erro ao buscar pedidos')
  }

  return (orders || []).map(order => ({
    id: order.id,
    status: order.status,
    createdAt: order.created_at,
    items: (order.order_items || []).map(item => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price || 0
    }))
  }))
}

export const deleteOrder = async (orderId: string) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    console.error('Erro ao deletar pedido:', error.message)
    throw new Error('Erro ao deletar pedido')
  }

  return { success: true }
}
