require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require ('./routes/productsRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes');

app.use(express.json()); 
app.use('/', authRoutes); 
app.use('/products', productRoutes);
app.use('/categories', categoriesRoutes);

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
