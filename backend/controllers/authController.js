const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../services/supabaseClient');

const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.json({ user: data.user });
};


const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        password: hashedPassword,
        name,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
  const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.status(201).json({
    message: 'Usuário registrado com sucesso',
    user: {
      id: data.id,
      email: data.email,
      name: data.name,
    },
    token,
  });
};

module.exports = { login, register,  };
