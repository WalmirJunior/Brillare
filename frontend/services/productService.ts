import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getAllProducts = async () => {
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('*')

  if (productError) throw new Error(productError.message)

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  const categoryMap = new Map(categories?.map(c => [c.id, c.name]))

  return (products || []).map(product => ({
    ...product,
    categoryName: categoryMap.get(product.category_id) || 'Categoria desconhecida'
  }))
}

export const getProductById = async (id: string) => {
  console.log('Buscando produto com id:', id);
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error || !product) throw new Error('Produto não encontrado');

  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', product.category_id)
    .single();

  return {
    ...product,
    categoryName: category?.name || 'Categoria desconhecida',
  };
};
