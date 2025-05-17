const supabase = require('../services/supabaseClient');

const getAllProducts = async (req, res) => {
  try {
    const { data: products, error: productError } = await supabase.from('products').select('*');
    const { data: categories } = await supabase.from('categories').select('id, name');

    if (productError) throw productError;

    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    const enrichedProducts = products.map(product => ({
      ...product,
      categoryName: categoryMap.get(product.category_id) || 'Categoria desconhecida'
    }));

    res.status(200).json(enrichedProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error || !product) return res.status(404).json({ error: 'Produto não encontrado' });

    const { data: category } = await supabase.from('categories').select('name').eq('id', product.category_id).single();
    res.status(200).json({ ...product, categoryName: category?.name || 'Categoria desconhecida' });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

const createProduct = async (req, res) => {
  const { name, price, stock, categoryId, description, image_url } = req.body;

  if (!name || price == null || stock == null || !categoryId) {
    return res.status(400).json({ error: 'Nome, preço, estoque e categoryId são obrigatórios' });
  }

  try {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (categoryError || !category) {
      return res.status(400).json({ error: 'Categoria inválida (não encontrada)' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        price: Number(price),
        stock: Number(stock),
        category_id: categoryId,
        description,
        image_url,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const { data: existing, error: existingError } = await supabase.from('products').select('*').eq('id', id).single();
    if (existingError || !existing) return res.status(404).json({ error: 'Produto não encontrado' });

    const { data, error } = await supabase.from('products').update(updatedData).eq('id', id).select().single();
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar o produto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: existing, error: fetchError } = await supabase.from('products').select('id').eq('id', id).single();
    if (fetchError || !existing) return res.status(404).json({ error: 'Produto não encontrado' });

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar o produto' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
