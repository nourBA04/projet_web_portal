const express = require("express");
const router = express.Router();

// Simuler une base de données pour les paramètres
let userSettings = {
  notification_settings: true,
  email_notifications: true,
  theme: "light",
  language: "en",
  two_factor_auth: false,
};

// Récupérer les paramètres
router.get("/", (req, res) => {
  res.json({ success: true, data: userSettings });
});

// Mettre à jour les paramètres
router.put("/", (req, res) => {
  const newSettings = req.body;
  userSettings = { ...userSettings, ...newSettings };
  res.json({ success: true, data: userSettings });
});

module.exports = router;