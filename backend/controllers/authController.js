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

module.exports = { login };
