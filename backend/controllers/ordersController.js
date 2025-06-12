const supabase = require('../services/supabaseClient');
const { v4: uuidv4 } = require('uuid');



const createOrder = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Itens são obrigatórios' });
  }

  try {
    
    let total = 0;
    const productsCache = {};

    for (const item of items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, stock, price, name')
        .eq('id', item.productId)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: `Produto com ID ${item.productId} não encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Estoque insuficiente para o produto: ${product.name}` });
      }

      total += product.price * item.quantity;
      productsCache[item.productId] = product;
    }

    const { data: creditData, error: creditError } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (creditError || !creditData || creditData.balance < total) {
      return res.status(400).json({ error: 'Saldo de créditos insuficiente' });
    }

    
    const orderId = uuidv4();
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{ id: orderId, user_id: userId, created_at: new Date().toISOString(), status: 'pendente' }]);
    if (orderError) throw orderError;

    for (const item of items) {
      const product = productsCache[item.productId];

      const { error: itemError } = await supabase
        .from('order_items')
        .insert([{
          order_id: orderId,
          product_id: product.id,
          quantity: item.quantity,
          price: product.price,
        }]);
      if (itemError) throw itemError;

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: product.stock - item.quantity })
        .eq('id', product.id);
      if (updateError) throw updateError;
    }

  
    await supabase
      .from('user_credits')
      .update({ balance: creditData.balance - total })
      .eq('user_id', userId);

    res.status(201).json({ message: 'Pedido criado com sucesso', orderId });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (ordersError) throw ordersError;

    for (const order of orders) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity, price')
        .eq('order_id', order.id);
      if (itemsError) throw itemsError;

      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos do usuário' });
  }
};

const getAllOrders = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (ordersError) throw ordersError;

    for (const order of orders) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity, price')
        .eq('order_id', order.id);
      if (itemsError) throw itemsError;

      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar todos os pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar todos os pedidos' });
  }
};


const deleteUserOrder = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (orderError || !order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (order.user_id !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este pedido' });
    }

    const { error: delItemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);
    if (delItemsError) throw delItemsError;

    const { error: delOrderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    if (delOrderError) throw delOrderError;

    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pedido do usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
};

const deleteAnyOrder = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { orderId } = req.params;

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (orderError || !order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const { error: delItemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);
    if (delItemsError) throw delItemsError;

    const { error: delOrderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    if (delOrderError) throw delOrderError;

    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pedido como admin:', error);
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  deleteUserOrder,
  deleteAnyOrder
};
