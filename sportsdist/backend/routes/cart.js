const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Récupérer les articles du panier
router.get('/', async (req, res) => {
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Non autorisé. Veuillez vous connecter.' });
  }

  try {
    // Récupérer les articles du panier pour l'utilisateur connecté
    const [cartItems] = await db.query(
      `SELECT cart.id, products.name, products.price, cart.quantity, 
              JSON_UNQUOTE(JSON_EXTRACT(products.image_variants, '$.default')) AS image 
       FROM cart 
       JOIN products ON cart.product_id = products.id 
       WHERE cart.customer_id = ?`,
      [userId]
    );

    // Convertir le prix en nombre si nécessaire
    const formattedCartItems = cartItems.map(item => ({
      ...item,
      price: parseFloat(item.price), // Convertir en nombre
    }));

    res.json({ success: true, cartItems: formattedCartItems });
  } catch (err) {
    console.error('Erreur lors de la récupération du panier:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Ajouter un produit au panier
router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Non autorisé. Veuillez vous connecter.' });
  }

  try {
    // Vérifier si le produit est déjà dans le panier
    const [existingItem] = await db.query(
      'SELECT * FROM cart WHERE customer_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingItem.length > 0) {
      // Mettre à jour la quantité si le produit est déjà dans le panier
      await db.query(
        'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
        [quantity, existingItem[0].id]
      );
    } else {
      // Ajouter le produit au panier
      await db.query(
        'INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    res.json({ success: true, message: 'Produit ajouté au panier.' });
  } catch (err) {
    console.error('Erreur lors de l\'ajout au panier:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Mettre à jour la quantité d'un produit dans le panier
router.put('/update/:id', async (req, res) => {
  const { quantity } = req.body;
  const cartItemId = req.params.id;
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Non autorisé. Veuillez vous connecter.' });
  }

  try {
    // Mettre à jour la quantité du produit dans le panier
    await db.query(
      'UPDATE cart SET quantity = ? WHERE id = ? AND customer_id = ?',
      [quantity, cartItemId, userId]
    );
    res.json({ success: true, message: 'Quantité mise à jour.' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la quantité:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Supprimer un produit du panier
router.delete('/remove/:id', async (req, res) => {
  const cartItemId = req.params.id;
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Non autorisé. Veuillez vous connecter.' });
  }

  try {
    // Supprimer le produit du panier
    await db.query(
      'DELETE FROM cart WHERE id = ? AND customer_id = ?',
      [cartItemId, userId]
    );
    res.json({ success: true, message: 'Produit supprimé du panier.' });
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;