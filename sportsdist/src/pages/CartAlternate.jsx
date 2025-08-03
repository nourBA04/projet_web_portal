import React, { useState, useEffect } from 'react';

const CartAlternate = ({ onNavigate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les articles du panier depuis le backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          credentials: 'include', // Inclure les cookies de session
        });
        const data = await response.json();
        if (data.success) {
          // Convertir le prix en nombre si nécessaire
          const formattedCartItems = data.cartItems.map(item => ({
            ...item,
            price: parseFloat(item.price), // Convertir en nombre
          }));
          setCartItems(formattedCartItems);
          calculateTotal(formattedCartItems);
        } else {
          setError(data.message || 'Erreur lors du chargement du panier.');
        }
      } catch (err) {
        setError('Erreur serveur.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Calculer le total du panier
  const calculateTotal = (items) => {
    const newTotal = items.reduce((acc, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return acc + (price * quantity);
    }, 0);
    setTotal(newTotal);
  };

  // Mettre à jour la quantité d'un produit dans le panier
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: 'include', // Inclure les cookies de session
      });
      const data = await response.json();
      if (data.success) {
        const updatedItems = cartItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour de la quantité.');
      }
    } catch (err) {
      setError('Erreur serveur.');
    }
  };

  // Supprimer un produit du panier
  const removeItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/remove/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Inclure les cookies de session
      });
      const data = await response.json();
      if (data.success) {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      } else {
        setError(data.message || 'Erreur lors de la suppression du produit.');
      }
    } catch (err) {
      setError('Erreur serveur.');
    }
  };

  // Fonction pour gérer le paiement
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_amount: total }), // Envoyer le montant total
        credentials: 'include', // Inclure les cookies de session
      });
      const data = await response.json();

      if (data.success) {
        alert('Commande créée avec succès !');
        // Rediriger vers une page de confirmation ou vider le panier
        setCartItems([]); // Vider le panier
        setTotal(0); // Réinitialiser le total
      } else {
        alert('Erreur lors de la création de la commande.');
      }
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
      alert('Erreur serveur.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">Chargement...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">Erreur : {error}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="sticky top-0 z-50 bg-zinc-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <button 
            onClick={() => onNavigate('/')}
            className="text-2xl font-bold text-cyan-400"
          >
            SportsDist
          </button>
        </div>
      </header>

      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold mb-8 text-cyan-400">Votre Panier</h2>

        {cartItems.length === 0 ? (
          <div className="text-center bg-zinc-800 p-12 rounded-xl">
            <p className="text-zinc-400 mb-4">Votre panier est vide</p>
            <button 
              onClick={() => onNavigate('/')}
              className="bg-cyan-500 text-zinc-900 px-6 py-3 rounded-full hover:bg-cyan-400"
            >
              Continuer les achats
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-zinc-800 rounded-xl p-6 flex items-center space-x-6"
                >
                  <img 
                    src={`http://localhost/sportsdist/backend${item.image}`} 
                    alt={item.name} 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h4 className="text-xl font-semibold">{item.name}</h4>
                    <p className="text-zinc-400">
                      Prix unitaire : {typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'} €
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-zinc-700 w-8 h-8 rounded-full"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-zinc-700 w-8 h-8 rounded-full"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Supprimer
                      </button>
                    </div>
                    <p className="mt-2 text-cyan-400 font-bold">
                      {(typeof item.price === 'number' && typeof item.quantity === 'number') 
                        ? (item.price * item.quantity).toFixed(2) 
                        : 'N/A'} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800 rounded-xl p-6 h-fit">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">
                Résumé de la Commande
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuit</span>
                </div>
                <hr className="border-zinc-700" />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-cyan-400">{total.toFixed(2)} €</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-cyan-500 text-zinc-900 py-3 rounded-full hover:bg-cyan-400 mt-6"
              >
                Procéder au Paiement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartAlternate;