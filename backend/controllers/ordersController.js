const { db } = require('../services/firebaseConfig');
const { v4: uuidv4 } = require('uuid');
const { doc, setDoc, collection, query, where, getDocs, orderBy,getDoc, updateDoc } = require('firebase/firestore');

const createOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;
  
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens são obrigatórios' });
    }
  
    try {
      for (const item of items) {
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);
  
        if (!productSnap.exists()) {
          return res.status(404).json({ error: `Produto com ID ${item.productId} não encontrado` });
        }
  
        const productData = productSnap.data();
  
        if (productData.stock < item.quantity) {
          return res.status(400).json({ error: `Estoque insuficiente para o produto: ${productData.name}` });
        }
  
        // Atualiza estoque
        await updateDoc(productRef, {
          stock: productData.stock - item.quantity,
        });
      }

      const orderId = uuidv4();
      const newOrder = {
        userId,
        createdAt: new Date().toISOString(),
        status: 'pendente',
        items,
      };
  
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, newOrder);
  
      res.status(201).json({ message: 'Pedido criado com sucesso', orderId });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  };

const getUserOrders = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      res.json(orders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      res.status(500).json({ error: 'Erro ao buscar pedidos do usuário' });
    }
  };
  
  const getAllOrders = async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
  
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      res.json(orders);
    } catch (error) {
      console.error("Erro ao buscar todos os pedidos:", error);
      res.status(500).json({ error: 'Erro ao buscar todos os pedidos' });
    }
  };
  
module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    
};
  