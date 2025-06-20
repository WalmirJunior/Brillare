const supabase = require('../services/supabaseClient');

const addCredits = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valor inválido' });
  }

  try {
    const { data: creditData, error: fetchError } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    let newBalance = amount;

    if (creditData) {
      newBalance = parseFloat(creditData.balance) + parseFloat(amount);
      await supabase
        .from('user_credits')
        .update({ balance: newBalance })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_credits')
        .insert({ user_id: userId, balance: amount });
    }

    res.json({ message: 'Créditos adicionados', newBalance });
  } catch (error) {
    console.error('Erro ao adicionar créditos:', error);
    res.status(500).json({ error: 'Erro ao adicionar créditos' });
  }
};

const getCredits = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    res.json({ balance: data.balance });
  } catch (err) {
    console.error('Erro ao buscar créditos:', err);
    res.status(500).json({ error: 'Erro ao buscar créditos' });
  }
};

module.exports = {
  addCredits,
  getCredits,
};
