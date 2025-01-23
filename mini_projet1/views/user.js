const bcrypt = require('bcrypt');

// Formulaire d'inscription
router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.session.user });
  });

  
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) throw err;
      res.redirect('/user/login');
    });
  });
  