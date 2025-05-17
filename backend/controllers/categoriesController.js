const supabase = require('../services/supabaseClient');

const getAllCategories = async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ error: 'Erro ao buscar categorias' });
  }

  res.status(200).json(data);
};


const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ error: 'Erro ao criar categoria' });
  }

  res.status(201).json(data);
};


const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }

  res.status(200).json(data);
};


const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao deletar categoria:', error);
    return res.status(500).json({ error: 'Erro ao deletar categoria' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }

  res.status(200).json({ message: 'Categoria deletada com sucesso' });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
