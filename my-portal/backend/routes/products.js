const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    // Désérialiser les champs JSON
    const formattedProducts = products.map((product) => {
      try {
        return {
          ...product,
          colors: JSON.parse(product.colors || '[]'),
          sizes: JSON.parse(product.sizes || '[]'),
          image_variants: JSON.parse(product.image_variants || '{}'),
        };
      } catch (err) {
        console.error("Erreur lors de la désérialisation des champs JSON:", err);
        return product; // Retourner le produit tel quel en cas d'erreur
      }
    });
    res.json({ success: true, products: formattedProducts });
  } catch (err) {
    console.error("Erreur lors de la récupération des produits:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Ajouter un nouveau produit
router.post("/", async (req, res) => {
  const { name, category, price, stock, colors, sizes, brand, image_variants } = req.body;
  try {
    // S'assurer que l'image par défaut est définie
    const imageVariants = image_variants || {};
    if (!imageVariants.default && Object.keys(imageVariants).length > 0) {
      imageVariants.default = Object.values(imageVariants)[0]; // Prendre la première image comme image par défaut
    }

    const [result] = await db.query(
      "INSERT INTO products (name, category, price, stock, colors, sizes, brand, image_variants) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        category,
        price,
        stock,
        JSON.stringify(colors),
        JSON.stringify(sizes),
        brand,
        JSON.stringify(imageVariants),
      ]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Erreur lors de l'ajout du produit:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Mettre à jour un produit existant
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, colors, sizes, brand, image_variants } = req.body;
  try {
    await db.query(
      "UPDATE products SET name = ?, category = ?, price = ?, stock = ?, colors = ?, sizes = ?, brand = ?, image_variants = ? WHERE id = ?",
      [
        name,
        category,
        price,
        stock,
        JSON.stringify(colors),
        JSON.stringify(sizes),
        brand,
        JSON.stringify(image_variants),
        id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du produit:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Supprimer un produit
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur lors de la suppression du produit:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;