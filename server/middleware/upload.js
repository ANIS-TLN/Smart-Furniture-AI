const multer = require("multer");
const path = require("path");

// Définition du stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Stocke les fichiers dans le dossier "uploads"
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renomme l'image avec un timestamp
  }
});

// Filtrer les fichiers pour accepter seulement les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error("Seules les images sont autorisées"), false); // Rejeter le fichier
  }
};

// Configuration finale de Multer
const upload = multer({
  storage: storage, // Stockage défini ci-dessus
  fileFilter: fileFilter, // Filtrage des fichiers
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille à 5 Mo
});

module.exports = upload;
