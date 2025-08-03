const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;