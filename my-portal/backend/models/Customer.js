// backend/models/Customers.jsx
const db = require("../config/db");

class Customer {
  // Récupérer tous les clients
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM customers");
    return rows;
  }

  // Créer un nouveau client
  static async create({ name, email, phone, company, address, city, country, status = "Active" }) {
    const [result] = await db.query(
      "INSERT INTO customers (name, email, phone, company, address, city, country, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone, company, address, city, country, status]
    );
    return { id: result.insertId, name, email, phone, company, address, city, country, status };
  }

  // Mettre à jour un client
  static async update(id, { name, email, phone, company, address, city, country, status }) {
    await db.query(
      "UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, address = ?, city = ?, country = ?, status = ? WHERE id = ?",
      [name, email, phone, company, address, city, country, status, id]
    );
    return { id, name, email, phone, company, address, city, country, status };
  }

  // Supprimer un client
  static async delete(id) {
    await db.query("DELETE FROM customers WHERE id = ?", [id]);
    return true;
  }
}

module.exports = Customer;