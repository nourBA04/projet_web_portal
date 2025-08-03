import React, { useState } from 'react';

const LoginModal = ({ onClose, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Pour gérer les cookies de session
      });
      const data = await response.json();

      if (data.success) {
        onClose(); // Fermer le modal après la connexion
        window.location.reload(); // Recharger la page pour mettre à jour l'état de connexion
      } else {
        setError(data.message || 'Échec de la connexion.');
      }
    } catch (err) {
      setError('Erreur lors de la connexion.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg p-8 relative">
        {/* Bouton pour fermer le modal */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Connexion</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-zinc-300">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="votre.email@exemple.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-zinc-300">
              Mot de passe
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyan-500 text-zinc-900 py-3 rounded-full hover:bg-cyan-400 transition"
          >
            Se Connecter
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-zinc-400">
            Pas de compte ? {' '}
            <button 
              onClick={onSignUpClick}
              className="text-cyan-400 hover:underline"
            >
              Inscrivez-vous
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;