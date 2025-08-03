const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, company, address, city, country } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const [existingUser] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    // Insérer le nouvel utilisateur (sans hacher le mot de passe)
    const [result] = await db.query(
      'INSERT INTO customers (name, email, password, phone, company, address, city, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, company, address, city, country] // Mot de passe en clair
    );

    res.status(201).json({ success: true, message: 'Inscription réussie.', userId: result.insertId });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const [user] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe (en clair)
    if (password !== user[0].password) {
      return res.status(400).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    // Créer une session
    req.session.userId = user[0].id;
    req.session.email = user[0].email;
    req.session.name = user[0].name; // Stocker le nom de l'utilisateur dans la session

    res.json({ 
      success: true, 
      message: 'Connexion réussie.', 
      user: { 
        id: user[0].id, 
        email: user[0].email, 
        name: user[0].name 
      } 
    });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Déconnexion
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur lors de la déconnexion.' });
    }
    res.json({ success: true, message: 'Déconnexion réussie.' });
  });
});

// Vérifier le statut de connexion
router.get('/status', (req, res) => {
  if (req.session.userId) {
    // Si l'utilisateur est connecté, renvoyer ses informations
    res.json({ 
      isLoggedIn: true, 
      user: { 
        id: req.session.userId, 
        email: req.session.email, 
        name: req.session.name 
      } 
    });
  } else {
    // Si l'utilisateur n'est pas connecté
    res.json({ isLoggedIn: false });
  }
});

module.exports = router;