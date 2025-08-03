import React, { useState } from 'react';

const SignUpModal = ({ onClose, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address }), // Inclure phone et address
      });
      const data = await response.json();

      if (data.success) {
        onClose(); // Fermer le modal après l'inscription
        onLoginClick(); // Ouvrir le modal de connexion
      } else {
        setError(data.message || 'Échec de l\'inscription.');
      }
    } catch (err) {
      setError('Erreur lors de l\'inscription.');
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

        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Inscription</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-zinc-300">
              Nom complet
            </label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Votre nom complet"
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-zinc-300">
              Confirmer le mot de passe
            </label>
            <input 
              type="password" 
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-zinc-300">
              Numéro de téléphone
            </label>
            <input 
              type="text" 
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Votre numéro de téléphone"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block mb-2 text-zinc-300">
              Adresse
            </label>
            <input 
              type="text" 
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Votre adresse"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyan-500 text-zinc-900 py-3 rounded-full hover:bg-cyan-400 transition"
          >
            S'inscrire
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-zinc-400">
            Déjà un compte ? {' '}
            <button 
              onClick={onLoginClick}
              className="text-cyan-400 hover:underline"
            >
              Connectez-vous
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;