import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout"; // Assurez-vous que le chemin d'import est correct
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers"; // Importez le composant Customers
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import CustomerDetail from "./pages/CustomerDetail";
import Orders from "./pages/Orders";
import Products from "./pages/Products"; // Ajoutez cette ligne

const App = () => {
  // Supprimer l'état d'authentification au chargement de l'application
  useEffect(() => {
    localStorage.removeItem("isAuthenticated");
  }, []);

  // Composant pour protéger les routes nécessitant une authentification
  const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Route de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} /> {/* Ajoutez cette ligne */}
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/products" element={<Products />} /> {/* Ajoutez cette ligne */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Rediriger vers /dashboard par défaut */}
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;