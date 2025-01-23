const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const { isAuthenticated } = require('../middlewares/auth');

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_patients',
});

// Ajouter un utilisateur
router.post('/register', (req, res) => {
  const { Prenom, nom, login, password } = req.body;
  const sql = 'INSERT INTO Utilisateur (Prenom, nom, login, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [Prenom, nom, login, password], (err, result) => {
    if (err) throw err;
    res.send('Utilisateur enregistré avec succès');
  });
});

// Enregistrer un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { Prenom, nom, login, password } = req.body;
  
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const sql = 'INSERT INTO Utilisateur (Prenom, nom, login, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [Prenom, nom, login, hashedPassword], (err, result) => {
      if (err) throw err;
      res.redirect('/user/login'); // Rediriger vers la page de connexion
    });
  });
  
  // Formulaire de connexion
router.get('/login', (req, res) => {
    res.render('login');
  });
  
  // Traiter la connexion
router.post('/login', (req, res) => {
    const { login, password } = req.body;
  
    const sql = 'SELECT * FROM Utilisateur WHERE login = ?';
    db.query(sql, [login], async (err, users) => {
      if (err) throw err;
  
      if (users.length > 0) {
        const user = users[0];
  
        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          // Stocker l'utilisateur dans la session
          req.session.user = { idUser: user.idUser, Prenom: user.Prenom, nom: user.nom };
          res.redirect('/'); // Rediriger vers la page d'accueil
        } else {
          res.send('Mot de passe incorrect');
        }
      } else {
        res.send('Utilisateur non trouvé');
      }
    });
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
    
module.exports = router;