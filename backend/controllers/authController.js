const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../services/supabaseClient');
const yup = require('yup');

const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: error.message });
  }
  const token = jwt.sign({ id: data.user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return res.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.name,
    },
    token,  
  });
};


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await registerSchema.validate({ name, email, password });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }

    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
      token,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 letras')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email inválido (use formato: exemplo@dominio.com)')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
});


module.exports = { login, register,  };
