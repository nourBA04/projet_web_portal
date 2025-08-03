const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Récupérer les revenus mensuels
router.get("/revenue", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(order_date, '%Y-%m') AS month,
        SUM(total_amount) AS revenue
      FROM orders
      GROUP BY month
      ORDER BY month
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Récupérer la croissance des clients
router.get("/customer-growth", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COUNT(*) AS new_customers
      FROM customers
      GROUP BY month
      ORDER BY month
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Récupérer les statistiques globales
router.get("/stats", async (req, res) => {
    try {
      const [totalRevenue] = await db.query(`
        SELECT SUM(total_amount) AS total_revenue FROM orders
      `);
      const [avgOrderValue] = await db.query(`
        SELECT AVG(total_amount) AS avg_order_value FROM orders
      `);
      const [customerRetention] = await db.query(`
        SELECT 
          (COUNT(DISTINCT customer_id) / (SELECT COUNT(*) FROM customers)) * 100 AS retention_rate
        FROM orders
      `);
  
      res.json({
        success: true,
        data: {
          // Convertir les valeurs en nombres
          totalRevenue: parseFloat(totalRevenue[0].total_revenue) || 0,
          avgOrderValue: parseFloat(avgOrderValue[0].avg_order_value) || 0,
          customerRetention: parseFloat(customerRetention[0].retention_rate) || 0,
        },
      });
    } catch (err) {
      console.error("Erreur serveur:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

module.exports = router;