const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const customersRoutes = require("./routes/customers");
const analyticsRoutes = require("./routes/analytics");
const settingsRoutes = require("./routes/settings");
const ordersRoutes = require("./routes/orders");
const productRoutes = require("./routes/products");
const db = require("./config/db");
const uploadRoutes = require("./routes/uploads"); // Importez le fichier des routes d'upload

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());

// Servir les fichiers statiques du frontend (React)
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Monter les routes d'authentification
app.use("/api", authRoutes);

// Monter les routes pour les clients
app.use("/api/customers", customersRoutes);

// Monter les routes pour les analytics
app.use("/api/analytics", analyticsRoutes);

// Monter les routes pour les paramètres
app.use("/api/settings", settingsRoutes);

// Monter les routes pour les commandes
app.use("/api/orders", ordersRoutes);

// Monter les routes pour les produits
app.use("/api/products", productRoutes);

// Monter les routes pour l'upload des images
app.use("/api/upload", uploadRoutes); // Montez la route d'upload

// Gestion des erreurs 404 (route non trouvée)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur globale:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Rediriger toutes les requêtes vers le frontend (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

process.env.TZ = 'Africa/Tunis';