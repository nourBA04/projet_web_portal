import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../services/api';
import LoginModal from '../components/LoginModal';
import SignUpModal from '../components/SignUpModal';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa'; // Import des icônes
import { ToastContainer, toast } from 'react-toastify'; // Import de react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Styles de react-toastify

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImages, setCurrentImages] = useState({}); // État pour gérer les images actuelles
  const [showLoginModal, setShowLoginModal] = useState(false); // État pour afficher le modal de connexion
  const [showSignUpModal, setShowSignUpModal] = useState(false); // État pour afficher le modal d'inscription
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État pour vérifier si l'utilisateur est connecté
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur connecté
  const [cartItemCount, setCartItemCount] = useState(0); // État pour le nombre d'articles dans le panier

  // Fetch categories and products from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData.categories);

        const productsData = await fetchProducts();
        setProducts(productsData.products);

        // Initialiser les images par défaut pour chaque produit
        const initialImages = {};
        productsData.products.forEach(product => {
          initialImages[product.id] = product.image_variants.default;
        });
        setCurrentImages(initialImages);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Vérifier si l'utilisateur est connecté et récupérer le panier
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/status', {
          credentials: 'include', // Inclure les cookies de session
        });
        const data = await response.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(data.user); // Stocker les informations de l'utilisateur

          // Récupérer les articles du panier
          const cartResponse = await fetch('http://localhost:3000/api/cart', {
            credentials: 'include',
          });
          const cartData = await cartResponse.json();
          if (cartData.success) {
            setCartItemCount(cartData.cartItems.length); // Mettre à jour le nombre d'articles
          }
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du statut de connexion:', err);
      }
    };

    checkLoginStatus();
  }, []);

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Inclure les cookies de session
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload(); // Recharger la page pour mettre à jour l'interface
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  // Filtrer les produits en fonction de la catégorie active
  const filteredProducts = activeCategory === 'all'
    ? products // Afficher tous les produits si "Tous" est sélectionné
    : products.filter(product => product.category === activeCategory); // Filtrer par catégorie

  // Gérer le survol d'un cercle de couleur
  const handleColorHover = (productId, color) => {
    const product = products.find(p => p.id === productId);
    if (product && product.image_variants[color]) {
      setCurrentImages(prev => ({
        ...prev,
        [productId]: product.image_variants[color],
      }));
    }
  };

  // Revenir à l'image par défaut lorsque le survol est terminé
  const handleColorLeave = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setCurrentImages(prev => ({
        ...prev,
        [productId]: product.image_variants.default,
      }));
    }
  };

  // Gérer l'ajout au panier
  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true); // Afficher le modal de connexion si l'utilisateur n'est pas connecté
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
        credentials: 'include', // Inclure les cookies de session
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Produit ajouté au panier !'); // Afficher un message de succès
        setCartItemCount(prev => prev + 1); // Mettre à jour le nombre d'articles dans le panier
      } else {
        toast.error('Erreur lors de l\'ajout au panier.'); // Afficher un message d'erreur
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      toast.error('Erreur serveur.'); // Afficher un message d'erreur
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
      {/* ToastContainer pour les notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000} // Fermer automatiquement après 3 secondes
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Dark Mode Navigation */}
      <header className="sticky top-0 z-50 bg-zinc-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Lien vers la page d'accueil */}
          <NavLink to="/" className="text-2xl font-bold text-cyan-400">
            SportsDist
          </NavLink>
          <nav className="flex space-x-4">
            {/* Ajouter une catégorie "Tous" */}
            <button 
              key="all"
              onClick={() => setActiveCategory('all')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full transition 
                ${activeCategory === 'all' 
                  ? 'bg-cyan-500 text-zinc-900' 
                  : 'hover:bg-zinc-700'}`}
            >
              <span>Tous</span>
            </button>
            {/* Afficher les catégories */}
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.name)} // Utilisez cat.name pour correspondre à product.category
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full transition 
                  ${activeCategory === cat.name 
                    ? 'bg-cyan-500 text-zinc-900' 
                    : 'hover:bg-zinc-700'}`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Bienvenue [nom utilisateur] */}
                <span className="text-cyan-400 hover:text-cyan-300 transition bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  Bienvenue, {user?.name}
                </span>

                {/* Icône du panier avec badge */}
                <NavLink to="/cart" className="text-cyan-400 hover:text-cyan-300 transition relative">
                  <FaShoppingCart className="w-6 h-6 hover:scale-110 transition-transform" /> {/* Icône du panier */}
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>

                {/* Icône de déconnexion avec animation */}
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 transition transform hover:scale-110"
                >
                  <FaSignOutAlt className="w-6 h-6" /> {/* Icône de déconnexion */}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="border border-zinc-700 text-white px-4 py-2 rounded-full hover:bg-zinc-700"
                >
                  Connexion
                </button>
                <button 
                  onClick={() => setShowSignUpModal(true)}
                  className="bg-cyan-500 text-zinc-900 px-4 py-2 rounded-full hover:bg-cyan-400"
                >
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Dark Hero Section */}
      <section className="bg-gradient-to-r from-zinc-800 to-zinc-900 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Votre Performance, Notre Passion
          </h2>
          <p className="text-zinc-400 text-xl mb-8">
            Découvrez des équipements qui transforment vos objectifs en réalité
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-cyan-500 text-zinc-900 px-6 py-3 rounded-full hover:bg-cyan-400">
              Explorer
            </button>
            <button className="border border-zinc-700 text-white px-6 py-3 rounded-full hover:bg-zinc-800">
              Nos Collections
            </button>
          </div>
        </div>
      </section>

      {/* Dark Product Grid */}
      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative">
                <img 
                  src={`http://localhost/sportsdist/backend${currentImages[product.id]}`}
                  alt={product.name} 
                  className={`w-full h-64 object-cover transition-transform 
                    ${hoveredProduct === product.id ? 'scale-110' : ''}`} 
                />
                {hoveredProduct === product.id && (
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 border-white`}
                        style={{backgroundColor: color}}
                        onMouseEnter={() => handleColorHover(product.id, color)}
                        onMouseLeave={() => handleColorLeave(product.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold text-lg">
                    {product.price ? parseFloat(product.price).toFixed(2) : 'N/A'} €
                  </span>
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-cyan-500 text-zinc-900 px-4 py-2 rounded-full hover:bg-cyan-400 transition"
                  >
                    Ajouter au Panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSignUpClick={() => {
            setShowLoginModal(false);
            setShowSignUpModal(true);
          }}
        />
      )}

      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          onLoginClick={() => {
            setShowSignUpModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Home;