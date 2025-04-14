const { db } = require('../services/firebaseConfig');

const {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} = require('firebase/firestore');

const getAllProducts = async (req, res) => {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const productData = productSnap.data();
    res.status(200).json({ id: productSnap.id, ...productData });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};


const createProduct = async (req, res) => {
  const { name, price, stock, category } = req.body;

  if (!name || price == null || !stock || !category) {
    return res.status(400).json({ error: 'Nome, preço, estoque e categoria são obrigatórios' });
  }

  try {
    const newProduct = {
      name,
      price: Number(price),
      stock: stock.toString(), 
      category,
      createdAt: new Date()
    };

    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, newProduct);

    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await updateDoc(productRef, updatedData);

    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar o produto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await deleteDoc(productRef);
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar o produto' });
  }
};

module.exports = {
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  getProductById 
};
