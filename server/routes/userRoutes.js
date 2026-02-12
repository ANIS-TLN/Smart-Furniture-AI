const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

//  Inscription
// Inscription
router.post("/register", async (req, res) => {
  try {
    const { nom, lastname, address, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nom, lastname, address, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        _id: newUser._id,
        nom: newUser.nom,
        lastname: newUser.lastname,
        address: newUser.address,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//  Connexion
// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Vérifie si l'utilisateur existe et si le mot de passe est correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Génère un token JWT
    const token = jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "3h" });

    // Envoie le token et les informations de l'utilisateur
    res.json({
      token,
      user: {
        _id: user._id,
        nom: user.nom,
        lastname: user.lastname,
        address: user.address,
        email: user.email,
      }, // Renvoi des informations utilisateur
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Obtenir les infos de l'utilisateur (Protégé par verifyToken)
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Ne renvoie pas le mot de passe
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Récupérer un vendeur par son ID
router.get("/:id", async (req, res) => {
  try {
    const vendeur = await User.findById(req.params.id).select("nom email"); // Sélectionner les infos utiles
    if (!vendeur) {
      return res.status(404).json({ success: false, message: "Vendeur non trouvé" });
    }
    res.json({ success: true, vendeur }); // Retourne l'objet vendeur
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error });
  }
});



// Mettre à jour les infos de l'utilisateur
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { nom, lastname, address, email, password } = req.body;

    const userId = req.user.userId;

    // Récupérer l'utilisateur actuel
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier si un autre utilisateur a déjà ce nom
    const nameTaken = await User.findOne({ nom, _id: { $ne: userId } });
    if (nameTaken) {
      return res.status(400).json({ message: "Ce nom est déjà utilisé par un autre utilisateur." });
    }

    // Vérifier si un autre utilisateur a déjà cet email
    const emailTaken = await User.findOne({ email, _id: { $ne: userId } });
    if (emailTaken) {
      return res.status(400).json({ message: "Cet email est déjà utilisé par un autre utilisateur." });
    }

    // Préparation des données à mettre à jour
    const updates = { nom, lastname, address, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    // Mise à jour et retour de l'utilisateur mis à jour sans le mot de passe
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur mise à jour utilisateur :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
});





// Route pour récupérer les statistiques du dashboard
router.get("/aut/stats", verifyToken, async (req, res, next) => {
  try {
    const totalUtilisateurs = await User.countDocuments();
    if (totalUtilisateurs === undefined) {
      throw new Error("Impossible de récupérer le nombre d'utilisateurs");
    }

    res.json({ totalUtilisateurs });
  } catch (err) {
    // Si une erreur survient, on la passe au gestionnaire global avec 'next()'
    next(err);
  }
});






module.exports = router;
