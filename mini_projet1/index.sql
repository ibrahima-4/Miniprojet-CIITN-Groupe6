CREATE DATABASE gestion_patients;

USE gestion_patients;

CREATE TABLE Patient (
    idPatient INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    age INT,
    tel VARCHAR(15),
    sexe CHAR(1),
    nationalite VARCHAR(50)
);

CREATE TABLE Dossier (
    idDossier INT AUTO_INCREMENT PRIMARY KEY,
    Datecreation DATE,
    idPatient INT,
    FOREIGN KEY (idPatient) REFERENCES Patient(idPatient)
);

CREATE TABLE Examen (
    idExamen INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(50),
    dateResultat DATE
);

CREATE TABLE Utilisateur (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    Prenom VARCHAR(50),
    nom VARCHAR(50),
    login VARCHAR(50),
    password VARCHAR(50)
);
