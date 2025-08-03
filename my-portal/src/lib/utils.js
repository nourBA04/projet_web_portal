/**
 * Combine plusieurs classes conditionnellement
 * @param {...string} classes - Liste des classes CSS
 * @returns {string} - Chaîne de classes combinée
 */
export const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  