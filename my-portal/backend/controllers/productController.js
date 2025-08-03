const pool = require("../config/db");

// Obtenir tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    // Exécuter une requête SQL pour récupérer tous les produits
    const [products] = await pool.query("SELECT * FROM products");
    res.json({ success: true, products });
  } catch (err) {
    console.error("Erreur lors de la récupération des produits:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Ajouter un produit
exports.createProduct = async (req, res) => {
  const { name, category, price, colors, sizes, brand, image_variants } = req.body;
  try {
    // Exécuter une requête SQL pour insérer un nouveau produit
    const [result] = await pool.query(
      "INSERT INTO products (name, category, price, colors, sizes, brand, image_variants) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, category, price, JSON.stringify(colors), JSON.stringify(sizes), brand, JSON.stringify(image_variants)]
    );
    res.json({ success: true, message: "Produit ajouté avec succès", productId: result.insertId });
  } catch (err) {
    console.error("Erreur lors de l'ajout du produit:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, colors, sizes, brand, image_variants } = req.body;
  try {
    // Exécuter une requête SQL pour mettre à jour un produit
    await pool.query(
      "UPDATE products SET name = ?, category = ?, price = ?, colors = ?, sizes = ?, brand = ?, image_variants = ? WHERE id = ?",
      [name, category, price, JSON.stringify(colors), JSON.stringify(sizes), brand, JSON.stringify(image_variants), id]
    );
    res.json({ success: true, message: "Produit mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du produit:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Exécuter une requête SQL pour supprimer un produit
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ success: true, message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du produit:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};