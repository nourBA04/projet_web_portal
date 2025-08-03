const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');
const cartRouter = require('./routes/cart'); // Importez les routes du panier

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Autoriser plusieurs origines
    const allowedOrigins = ['http://localhost:5173','http://localhost:5174', 'http://localhost:5175'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Autoriser la requête
    } else {
      callback(new Error('Origine non autorisée par CORS')); // Bloquer la requête
    }
  },
  credentials: true, // Autoriser les cookies de session
}));
app.use(express.json());

// Configuration des sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'votre_clé_secrète', // Clé secrète pour signer les cookies de session
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Utiliser `true` si vous utilisez HTTPS
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 // 24 heures
  }
}));

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cart', cartRouter); // Utilisez les routes du panier

// Route de test
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});