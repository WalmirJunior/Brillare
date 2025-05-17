const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const yup = require('yup');
const supabase = require('../services/supabaseClient');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await registerSchema.validate({ name, email, password });

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role: 'user' }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: data.id, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      token,
    });
  } catch (err) {
    console.error('Erro no registro:', err.message);
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

const registerSchema = yup.object().shape({
  name: yup.string().min(2, 'Nome deve ter pelo menos 2 letras').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
});

module.exports = { login, register };
