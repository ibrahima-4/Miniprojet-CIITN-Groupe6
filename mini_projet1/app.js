const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');


const app = express();

// Configuration du serveur
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_patients',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

// Routes
const patientRoutes = require('./routes/patient');
const userRoutes = require('./routes/user');

app.use('/patient', patientRoutes);
app.use('/user', userRoutes);

// Configuration de la session
const session = require('express-session');

app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Utilise secure: true uniquement avec HTTPS
  })
);

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/user/login');
  }
}

// Démarrage du serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});


// app.use(session({
//   secret: 'secret_key', // Change ce secret en un secret sécurisé
//   resave: false,
//   saveUninitialized: true
// }));
