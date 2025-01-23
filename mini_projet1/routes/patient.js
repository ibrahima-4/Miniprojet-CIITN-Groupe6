const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth'); // Import correct
const mysql = require('mysql');

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_patients',
});
  
// Ajouter un patient
router.post('/add', (req, res) => {
  const { nom, prenom, age, tel, sexe, nationalite } = req.body;
  const sql = 'INSERT INTO Patient (nom, prenom, age, tel, sexe, nationalite) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nom, prenom, age, tel, sexe, nationalite], (err, result) => {
    if (err) throw err;
    res.send('Patient ajouté avec succès');
  });
});

router.get('/list', (req, res) => {
    const sql = 'SELECT * FROM Patient';
    db.query(sql, (err, patients) => {
      if (err) throw err;
      res.render('list_patients', { patients });
    });
  });
  
  // Afficher le formulaire pour modifier un patient
router.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM Patient WHERE idPatient = ?';
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('edit_patient', { patient: result[0] });
    });
  });

  // Modifier un patient
router.post('/edit/:id', (req, res) => {
    const { nom, prenom, age, tel, sexe, nationalite } = req.body;
    const sql = `UPDATE Patient SET nom = ?, prenom = ?, age = ?, tel = ?, sexe = ?, nationalite = ? WHERE idPatient = ?`;
    db.query(sql, [nom, prenom, age, tel, sexe, nationalite, req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect('/patient/list');
    });
  });

  // Supprimer un patient
router.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM Patient WHERE idPatient = ?';
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect('/patient/list');
    });
  });

// Afficher le formulaire pour ajouter un dossier
router.get('/dossier/add', (req, res) => {
    const sql = 'SELECT idPatient, nom, prenom FROM Patient';
    db.query(sql, (err, patients) => {
      if (err) throw err;
      res.render('add_dossier', { patients });
    });
  });
  
  // Ajouter un dossier
  router.post('/dossier/add', (req, res) => {
    const { idPatient, Datecreation } = req.body;
    const sql = 'INSERT INTO Dossier (Datecreation, idPatient) VALUES (?, ?)';
    db.query(sql, [Datecreation, idPatient], (err, result) => {
      if (err) throw err;
      res.send('Dossier ajouté avec succès');
    });
  });

  // Visualiser un dossier
router.get('/dossier/view/:id', (req, res) => {
    const sql = `
      SELECT * FROM Dossier
      JOIN Patient ON Dossier.idPatient = Patient.idPatient
      WHERE Dossier.idDossier = ?`;
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('view_dossier', { dossier: result[0] });
    });
  });

  // Afficher la liste des dossiers
router.get('/dossier/list', (req, res) => {
    const sql = `
      SELECT Dossier.idDossier, Dossier.Datecreation, Patient.nom, Patient.prenom 
      FROM Dossier 
      JOIN Patient ON Dossier.idPatient = Patient.idPatient`;
    db.query(sql, (err, dossiers) => {
      if (err) throw err;
      res.render('list_dossiers', { dossiers });
    });
  });

// Afficher le formulaire pour mettre à jour un dossier
router.get('/dossier/update/:id', (req, res) => {
    const sql = 'SELECT * FROM Dossier WHERE idDossier = ?';
    db.query(sql, [req.params.id], (err, dossier) => {
      if (err) throw err;
      res.render('update_dossier', { dossier: dossier[0] });
    });
  });
    
  router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});


module.exports = router;