const express = require('express');
const db = require('../config/db');
const PDFDocument = require('pdfkit'); // Pour générer des PDF
const router = express.Router();

// Créer une commande
router.post('/', async (req, res) => {
  const { total_amount } = req.body;
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Non autorisé. Veuillez vous connecter.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES (?, CURDATE(), ?, "Pending")',
      [userId, total_amount]
    );
    res.json({ success: true, message: 'Commande créée avec succès.', orderId: result.insertId });
  } catch (err) {
    console.error('Erreur lors de la création de la commande:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Mettre à jour le statut d'une commande
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    res.json({ success: true, message: 'Statut de la commande mis à jour avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Exporter une commande en PDF
router.get('/:id/export-pdf', async (req, res) => {
  const orderId = req.params.id;

  try {
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order_${orderId}.pdf`);
    doc.pipe(res);

    doc.fontSize(25).text(`Commande #${orderId}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${order[0].order_date}`);
    doc.text(`Statut: ${order[0].status}`);
    doc.text(`Montant total: ${order[0].total_amount} €`);
    doc.moveDown();

    doc.fontSize(18).text('Articles de la commande:');
    items.forEach(item => {
      doc.text(`- ${item.quantity}x Produit #${item.product_id} (${item.price} €)`);
    });

    doc.end();
  } catch (err) {
    console.error('Erreur lors de l\'exportation de la commande en PDF:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;