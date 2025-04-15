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

    const categoriesCol = collection(db, 'categories');
    const categoriesSnap = await getDocs(categoriesCol);
    const categoryMap = new Map();
    categoriesSnap.forEach(doc => {
      categoryMap.set(doc.id, doc.data().name);
    });

    const productsCol = collection(db, 'products');
    const productsSnap = await getDocs(productsCol);

    const products = productsSnap.docs.map(doc => {
      const data = doc.data();
      const categoryName = categoryMap.get(data.categoryId) || 'Categoria desconhecida';

      return {
        id: doc.id,
        ...data,
        categoryName
      };
    });

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

    const categoryRef = doc(db, 'categories', productData.categoryId);
    const categorySnap = await getDoc(categoryRef);
    const categoryName = categorySnap.exists() ? categorySnap.data().name : 'Categoria desconhecida';

    res.status(200).json({
      id: productSnap.id,
      ...productData,
      categoryName
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};



const createProduct = async (req, res) => {
  const { name, price, stock, categoryId } = req.body;

  if (!name || price == null || !stock || !categoryId) {
    return res.status(400).json({ error: 'Nome, preço, estoque e categoryId são obrigatórios' });
  }

  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return res.status(400).json({ error: 'Categoria inválida (não encontrada)' });
    }

    const newProduct = {
      name,
      price: Number(price),
      stock: stock.toString(),
      categoryId,
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

    let categoryName = null;
    if (updatedData.categoryId) {
      const categoryRef = doc(db, 'categories', updatedData.categoryId);
      const categorySnap = await getDoc(categoryRef);
      categoryName = categorySnap.exists() ? categorySnap.data().name : 'Categoria desconhecida';
    }

    res.status(200).json({
      id,
      ...updatedData,
      ...(categoryName && { categoryName })
    });
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
