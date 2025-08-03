import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchProducts } from '../services/api';

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState({
    size: [],
    color: [],
    price: null
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData.categories);

        const productsData = await fetchProducts();
        setProducts(productsData.products);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on active category and selected filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesPrice = !selectedFilters.price || (
      selectedFilters.price === '0-100' && product.price <= 100 ||
      selectedFilters.price === '100-500' && product.price > 100 && product.price <= 500 ||
      selectedFilters.price === '500+' && product.price > 500
    );
    return matchesCategory && matchesPrice;
  });

  if (loading) {
    return <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">Chargement...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">Erreur : {error}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Categories Navigation */}
      <header className="sticky top-0 z-50 bg-zinc-800 shadow-md">
        <div className="container mx-auto p-4">
          <nav className="flex space-x-4 overflow-x-auto">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full transition 
                  ${activeCategory === cat.id 
                    ? 'bg-cyan-500 text-zinc-900' 
                    : 'hover:bg-zinc-700'}`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Products Grid */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Filters */}
        <div className="hidden md:block bg-zinc-800 p-4 rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Filtres</h3>
          
          {/* Price Filter */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Prix</h4>
            <select 
              className="w-full bg-zinc-700 text-white p-2 rounded"
              onChange={(e) => setSelectedFilters({
                ...selectedFilters, 
                price: e.target.value
              })}
            >
              <option value="">Tous les prix</option>
              <option value="0-100">0 - 100 €</option>
              <option value="100-500">100 - 500 €</option>
              <option value="500+">500+ €</option>
            </select>
          </div>
        </div>

        {/* Products List */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-zinc-800 rounded-xl overflow-hidden group"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-64 object-cover group-hover:scale-110 transition"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-zinc-400 text-sm mb-2">{product.brand}</p>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold">
                    {product.price.toFixed(2)} €
                  </span>
                  <button className="bg-cyan-500 text-zinc-900 px-3 py-2 rounded-full text-sm hover:bg-cyan-400">
                    Ajouter
                  </button>
                </div>
                <div className="mt-2 flex space-x-2">
                  {product.colors.map(color => (
                    <span 
                      key={color} 
                      className="w-4 h-4 rounded-full" 
                      style={{backgroundColor: color}}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;