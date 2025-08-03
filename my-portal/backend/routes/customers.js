const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Récupérer tous les clients
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers");
    res.json({ success: true, customers: rows });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Récupérer un client par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.json({ success: true, customer: rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Client non trouvé" });
    }
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Créer un nouveau client
router.post("/", async (req, res) => {
  const { name, email, phone, company, address, city, country, status = "Active", password } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO customers (name, email, phone, company, address, city, country, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone, company, address, city, country, status, password]
    );
    res.json({ success: true, customer: { id: result.insertId, ...req.body } });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Mettre à jour un client
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, address, city, country, status, password } = req.body;

  try {
    await db.query(
      "UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, address = ?, city = ?, country = ?, status = ?, password = ? WHERE id = ?",
      [name, email, phone, company, address, city, country, status, password, id]
    );
    res.json({ success: true, customer: { id, ...req.body } });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Supprimer un client
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM customers WHERE id = ?", [id]);
    res.json({ success: true, message: "Customer deleted" });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;