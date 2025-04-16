const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado: somente admins' });
    }
    next();
  };
  
  module.exports = isAdmin;
  