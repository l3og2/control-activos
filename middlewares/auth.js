// Middleware de autenticación simple

const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  // Si se solicita HTML, redirigimos al login; si no (API), devolvemos 401.
  if (req.accepts('html')) {
    return res.redirect('/login');
  }

  return res.status(401).json({ error: 'No autorizado' });
};

module.exports = {
  requireLogin,
};
