const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken'); // Pour générer des tokens JWT

/**
 * Connexion de l'utilisateur
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherchez l'utilisateur par e-mail
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];

    // Comparez le mot de passe en texte brut
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Générez un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, 'SECRET_KEY', { expiresIn: '1h' });

    // Définissez un cookie sécurisé avec le token
    res.cookie('token', token, {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: process.env.NODE_ENV === 'production', // Utilisez HTTPS en production
      sameSite: 'strict', // Protège contre les attaques CSRF
    });

    // Réponse réussie
    res.json({
      success: true,
      email: user.email,
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Vérifier l'authentification de l'utilisateur
 */
router.get('/check-auth', async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    // Vérifiez le token JWT
    const decoded = jwt.verify(token, 'SECRET_KEY');
    res.json({ isAuthenticated: true, email: decoded.email });
  } catch (err) {
    res.json({ isAuthenticated: false });
  }
});

/**
 * Déconnexion de l'utilisateur
 */
router.post('/logout', (req, res) => {
  // Supprimez le cookie
  res.clearCookie('token');
  res.json({ success: true });
});

module.exports = router;