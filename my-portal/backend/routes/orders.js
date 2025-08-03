const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Récupérer toutes les commandes
const moment = require('moment-timezone');

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");

    // Formater les dates dans le fuseau horaire de Tunis
    const formattedOrders = rows.map((order) => {
      const timeZone = "Africa/Tunis";

      // Vérifier si les dates existent
      const created_at = order.created_at
        ? moment.utc(order.created_at).tz(timeZone).format('DD/MM/YYYY HH:mm')
        : null;
      const updated_at = order.updated_at
        ? moment.utc(order.updated_at).tz(timeZone).format('DD/MM/YYYY HH:mm')
        : null;

      return {
        ...order,
        created_at,
        updated_at,
      };
    });

    res.json({ success: true, orders: formattedOrders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Ajouter une nouvelle commande
router.post("/", async (req, res) => {
  const { customer_id, total_amount, status } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)",
      [customer_id, total_amount, status]
    );
    res.json({ success: true, orderId: result.insertId });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Mettre à jour une commande
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status, total_amount } = req.body;

  try {
    await db.query("UPDATE orders SET status = ?, total_amount = ? WHERE id = ?", [
      status,
      total_amount,
      id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Supprimer une commande
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;