const express = require("express");
const Produit = require("../models/produitModel");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/authMiddleware");
const Commande = require("../models/commandeModel");

const router = express.Router();


// obtenir tt les ms qui ne sont pas de ladmin
router.get("/all", async (req, res) => {
  try {
    const adminId = "67d58664c14a211ded9e25ed"; 
    const produits = await Produit.find({
      valider: true,
      vendeur_id: { $ne: adminId }
    });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// Obtenir tous les produits d'un administrateur
router.get("/", async (req, res) => {
  try {
    const adminId = "67d58664c14a211ded9e25ed"; //  l'ID de l'admin
    const produits = await Produit.find({ vendeur_id: adminId });

    console.log(produits);
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// Obtenir tous les produits selon la categorie
router.get("/categorie", async (req, res) => {
  try {
    const { q } = req.query; // Récupérer la catégorie depuis la requête
    if (!q) {
      return res.status(400).json({ message: "Catégorie requise" });
    }

    const produits = await Produit.find({ categorie: q, valider: true });
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});





// Route pour rechercher des produits
router.get("/recherche", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) {
        return res.status(400).json({ message: "Veuillez fournir un terme de recherche." });
      }
  
      // Recherche dans MongoDB
      const produits = await Produit.find({
        nom: { $regex: query, $options: "i" }, 
        valider: true      // Recherche insensible à la casse
      });
  
      res.json(produits);
    } catch (error) {
      console.error("Erreur de recherche :", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });



  //ajouter un commentaire

  router.post("/:id/comment", verifyToken, async (req, res) => {
    try {
       console.log("Utilisateur extrait du token :", req.user);  // Ajout de ce log
        const { commentaire, note } = req.body;
        const produitId = req.params.id;
        const userId = req.user.userId; // Récupère l'ID de l'utilisateur depuis le token

        const produit = await Produit.findById(produitId);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        
        produit.commentaires.push({
           utilisateur_id: userId,
            commentaire,
            note,
            date: new Date()
        });

        await produit.save();
        res.status(201).json({ message: "Commentaire ajouté avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});



// Route pour récupérer les produits vendus par l'utilisateur
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId; // L'ID de l'utilisateur depuis l'URL

    // Trouver tous les produits dont le vendeur est l'utilisateur spécifié
    const produits = await Produit.find({ vendeur_id: userId, valider: true });


    res.json(produits); // Retourner les produits trouvés
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des produits." });
  }
});




// Route pour récupérer les produits pas encore valide par l'utilisateur 
router.get("/nnvalide/user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId; // L'ID de l'utilisateur depuis l'URL

    // Trouver tous les produits dont le vendeur est l'utilisateur spécifié
    const produits = await Produit.find({ vendeur_id: userId, valider: false });


    res.json(produits); // Retourner les produits trouvés
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des produits." });
  }
});


// Route pour récupérer tout les produits pas encore valide 
router.get("/nnvalide/user", verifyToken, async (req, res) => {
  try {
    const produits = await Produit.find({  valider: false });
    res.json(produits); // Retourner les produits trouvés
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des produits." });
  }
});







// Ajouter un produit avec upload d'images
// Ajouter un produit avec upload d'images
router.post("/", verifyToken, upload.array("images", 4), async (req, res) => {
  try {
    const {
      nom,
      description,
      prixReduction,
      prix,
      categorie,
      dimensions,
      couleur,
      materiau,
      etat,
      quantite_disponible,
    } = req.body;
    const images = req.files.map((file) => file.path); // Récupérer les chemins des images

    const userId = req.user.userId;
    const adminId = "67d58664c14a211ded9e25ed"; // ID de l'admin

    const produit = new Produit({
      nom,
      description,
      prixReduction,
      prix,
      categorie,
      dimensions: JSON.parse(dimensions), // Convertir en objet si envoyé en JSON
      couleur,
      materiau,
      etat,
      quantite_disponible,
      vendeur_id: userId,
      images,
      commentaires: [],
      valider: userId === adminId ? true : false // <<< Ici la logique
    });

    await produit.save();
    console.log("Produit ajouté avec succès:", produit);
    res
      .status(201)
      .json({ message: "Produit ajouté avec succès", produit: produit });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


// Obtenir tous les produits (sans filtre)
router.get("/", async (req, res) => {
  try {
    const produits = await Produit.find({ valider: true });
    res.json(produits); // Renvoie directement le tableau de produits
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Obtenir tous les produits d'un vendeur spécifique
router.get("/vendeur/:vendeurId", async (req, res) => {
  try {
    const produits = await Produit.find({ vendeur_id: req.params.vendeurId ,valider: true});
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Supprimer un produit
router.delete("/:id", async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Mettre à jour un produit
router.put("/:id", upload.array("images", 4), async (req, res) => {
  try {
    const produitId = req.params.id;
    const updateData = { ...req.body };
    
    // Process existing images
    let imagePaths = [];
    if (req.body.existingImages) {
      const existingImages = JSON.parse(req.body.existingImages);
      imagePaths = [...existingImages]; // Start with existing images that weren't deleted
    }
    
    // Add new uploaded images if any
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => file.path);
      imagePaths = [...imagePaths, ...newImagePaths];
    }
    
    // Set the updated images array
    updateData.images = imagePaths;
    
    // Parse dimensions if present
    if (updateData.dimensions) {
      updateData.dimensions = JSON.parse(updateData.dimensions);
    }
    
    // Remove the existingImages field as it's not part of the model
    delete updateData.existingImages;

    const produitMisAJour = await Produit.findByIdAndUpdate(
      produitId,
      updateData,
      { new: true }
    );

    if (!produitMisAJour) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({
      message: "Produit mis à jour avec succès",
      produit: produitMisAJour,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Obtenir tous les produits (sans filtre)
router.get("/", async (req, res) => {
  try {
    const produits = await Produit.find({valider: true});
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



// Route pour récupérer les statistiques du dashboard
router.get("/pro/stats", async (req, res) => {
  try {
    const produitsAValider = await Produit.countDocuments({ valider: false });
    const totalProduits = await Produit.countDocuments(); // Total de tous les produits
    res.json({ produitsAValider, totalProduits });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});



// Valider un produit
router.put("/valider/:id", async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    produit.valider = true;
    await produit.save();

    res.status(200).json({ message: "Produit validé avec succès", produit });
  } catch (error) {
    console.error("Erreur de validation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});






module.exports = router;
