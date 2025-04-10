const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const yup = require('yup');
require('dotenv').config(); 
const { createClient } = require('@supabase/supabase-js');


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const registerSchema = yup.object().shape({
  name: yup.string().min(2, 'Nome deve ter pelo menos 2 letras').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
});

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
