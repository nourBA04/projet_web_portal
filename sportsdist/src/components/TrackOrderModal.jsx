import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Pour l'accessibilité

const TrackOrderModal = ({ isOpen, onRequestClose, orderId }) => {
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Récupérer le statut de la commande depuis le backend
      const fetchOrderStatus = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`);
          const data = await response.json();
          setOrderStatus(data.status);
        } catch (err) {
          console.error('Erreur lors de la récupération du statut de la commande:', err);
        }
      };

      fetchOrderStatus();
    }
  }, [isOpen, orderId]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Suivi de la commande"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Suivi de la commande #{orderId}</h2>
      <p>Statut: {orderStatus}</p>
      <button onClick={onRequestClose}>Fermer</button>
    </Modal>
  );
};

export default TrackOrderModal;