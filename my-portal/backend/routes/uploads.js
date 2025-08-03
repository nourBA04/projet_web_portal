const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Chemin absolu vers le dossier "uploads"
const uploadsDir = path.join(__dirname, "../uploads");

// Créer le dossier "uploads" s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration de multer pour stocker les images dans le dossier "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    // Utiliser le nom d'origine du fichier
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint pour uploader une image
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Aucun fichier téléchargé" });
  }
  const imageUrl = `/uploads/${req.file.filename}`; // URL de l'image
  res.json({ success: true, imageUrl });
});

module.exports = router;