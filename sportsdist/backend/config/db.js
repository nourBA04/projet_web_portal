// backend/config/db.js
const mysql = require('mysql2/promise');

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: 'localhost', // ou 127.0.0.1
  user: 'root', // Nom d'utilisateur MySQL
  password: 'saloua77', // Mot de passe MySQL
  database: 'customer_portal', // Nom de la base de données
  waitForConnections: true, // Attendre une connexion disponible si toutes sont occupées
  connectionLimit: 10, // Nombre maximal de connexions dans le pool
  queueLimit: 0, // Nombre maximal de requêtes en attente (0 = pas de limite)
});

// Tester la connexion à la base de données
(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Connexion réussie à la base de données MySQL.');
  } catch (err) {
    console.error('❌ Erreur de connexion à la base de données MySQL:', err);
  } finally {
    if (connection) connection.release(); // Libérer la connexion dans tous les cas
  }
})();

// Exporter le pool de connexions pour être utilisé dans d'autres fichiers
module.exports = pool;