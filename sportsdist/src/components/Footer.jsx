import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-zinc-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p className="text-zinc-400">
          &copy; {new Date().getFullYear()} SportsDist. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;