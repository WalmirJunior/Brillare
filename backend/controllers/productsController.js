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

module.exports = { getAllProducts };
