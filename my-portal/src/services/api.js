const API_URL = "/api"; // URL relative (via le proxy Vite)

const api = {
  /**
   * Login utilisateur
   * @param {Object} credentials - Contient email et password
   * @returns {Promise<Object>} Réponse de l'API
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Inclure les cookies dans la requête
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  },

  /**
   * Vérifier l'authentification de l'utilisateur
   * @returns {Promise<Object>} Réponse de l'API
   */
  checkAuth: async () => {
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        credentials: "include", // Inclure les cookies dans la requête
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      throw error;
    }
  },

  /**
   * Déconnexion de l'utilisateur
   * @returns {Promise<Object>} Réponse de l'API
   */
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include", // Inclure les cookies dans la requête
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  },

  /**
   * Récupérer les détails d'un client
   * @param {string} id - ID du client
   * @returns {Promise<Object>} Réponse de l'API
   */
  getCustomer: async (id) => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`);
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du client:", error);
      throw error;
    }
  },

  /**
   * Récupérer tous les clients
   * @returns {Promise<Object>} Réponse de l'API
   */
  fetchCustomers: async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }
  },

  /**
   * Créer un nouveau client
   * @param {Object} customer - Données du client
   * @returns {Promise<Object>} Réponse de l'API
   */
  createCustomer: async (customer) => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      throw error;
    }
  },

  /**
   * Mettre à jour un client
   * @param {string} id - ID du client
   * @param {Object} customer - Données du client
   * @returns {Promise<Object>} Réponse de l'API
   */
  updateCustomer: async (id, customer) => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      throw error;
    }
  },

  /**
   * Supprimer un client
   * @param {string} id - ID du client
   * @returns {Promise<Object>} Réponse de l'API
   */
  deleteCustomer: async (id) => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      throw error;
    }
  },

  /**
   * Récupérer les paramètres de l'utilisateur
   * @returns {Promise<Object>} Réponse de l'API
   */
  getSettings: async () => {
    try {
      const response = await fetch(`${API_URL}/settings`);
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres:", error);
      throw error;
    }
  },

  /**
   * Mettre à jour les paramètres de l'utilisateur
   * @param {Object} settings - Les nouveaux paramètres
   * @returns {Promise<Object>} Réponse de l'API
   */
  updateSettings: async (settings) => {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      throw error;
    }
  },
};

export default api; // Exportation par défaut