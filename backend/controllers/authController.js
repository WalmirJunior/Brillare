const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const yup = require('yup');
const { auth, db } = require('../services/firebaseConfig');
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} = require('firebase/auth');
const { doc, setDoc, getDoc } = require('firebase/firestore');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await registerSchema.validate({ name, email, password });
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role: 'user',
    });

    const token = jwt.sign(
      { id: user.uid, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: user.uid,
        name,
        email,
        role: 'user',
      },
      token,
    });

  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.exists() ? docSnap.data() : {};
    const name = userData.name || null;
    const role = userData.role || 'user'; 
    const token = jwt.sign(
      { id: user.uid, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    res.json({
      user: {
        id: user.uid,
        email: user.email,
        name,
        role
      },
      token
    });
  } catch (err) {
    res.status(401).json({ error: 'Email ou senha inválidos' });
  }
};

const registerSchema = yup.object().shape({
  name: yup.string().min(2, 'Nome deve ter pelo menos 2 letras').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
});

module.exports = { login, register };
