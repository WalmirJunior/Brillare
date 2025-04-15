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

const getAllCategories = async (req, res) => {
  try {
    const categoriesCol = collection(db, 'categories');
    const snapshot = await getDocs(categoriesCol);
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};


const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
  }

  try {
    const newCategory = { name, createdAt: new Date() };
    const categoriesCol = collection(db, 'categories');
    const docRef = await addDoc(categoriesCol, newCategory);

    res.status(201).json({ id: docRef.id, ...newCategory });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
};


const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
  }

  try {
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await updateDoc(categoryRef, { name });

    res.status(200).json({ id, name });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};


const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await deleteDoc(categoryRef);
    res.status(200).json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
