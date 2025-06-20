require('dotenv').config();
const express = require('express');
const cors = require("cors");
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require ('./routes/productsRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const creditsRoutes = require('./routes/creditsRoutes');


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, 
}));

app.use(express.json()); 
app.use('/', authRoutes); 
app.use('/products', productRoutes);
app.use('/categories', categoriesRoutes);
app.use('/orders', ordersRoutes);
app.use('/api/credits', creditsRoutes);


app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
