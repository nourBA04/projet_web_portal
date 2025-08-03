module.exports = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'Non autorisé. Veuillez vous connecter.' });
    }
    next();
  };