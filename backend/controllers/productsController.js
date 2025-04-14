const supabase = require('../services/supabaseClient');

const getAllProducts = async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    return res.status(500).json({ error: 'Erro ao buscar produtos' });
  }

  res.status(200).json(data);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const { data, error } = await supabase
    .from('products')
    .update(updatedData)
    .eq('id', id)
    .select(); // retorna o item atualizado

  if (error) {
    return res.status(500).json({ error: 'Erro ao atualizar o produto' });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  res.status(200).json(data[0]);
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select(); 

  if (error) {
    return res.status(500).json({ error: 'Erro ao deletar o produto' });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  res.status(200).json({ message: 'Produto deletado com sucesso' });
};



module.exports = {
  getAllProducts,
  updateProduct,
  deleteProduct,
};
