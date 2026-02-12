const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const vm = require('vm'); // Pour exécution sandboxée
const { GoogleGenerativeAI } = require('@google/generative-ai');
const produit = require('../models/produitModel');
const userModel = require('../models/userModel');
const commandeModel = require('../models/commandeModel');
// 💡 Remplace ceci par ta vraie clé API

const genAI = new GoogleGenerativeAI(" key gemini");


// 🎯 Contexte que le bot utilisera pour filtrer les réponses


const CONTEXT = `Tu es un agent chatbot intelligent pour le site e-commerce FurnishUp.

FurnishUp est une plateforme spécialisée dans la vente et l’achat de meubles pour la maison.  
Les utilisateurs peuvent acheter des meubles (Salon, Cuisine, Salle de bains, ,Rangement ,Exterieur ,Chambre, Bureau, Décoration, ) ou en vendre.  

### Fonctionnement du site :

🔸 Pour acheter :
- L’utilisateur consulte les produits, les ajoute au panier, puis procède au paiement (carte bancaire ou autre).
- Il doit être connecté (ou créer un compte s’il n’en a pas).
- Il fournit son adresse pour la livraison.

🔸 Pour vendre :
- L’utilisateur (acheteur ou vendeur) ajoute un produit via son profil.
- Il choisit une catégorie, renseigne les informations (prix, état, etc.).
- Le produit est validé par un administrateur avant d’être visible.

---

### 📚 Schéma de la base de données :

🧑‍💼 **User**
- nom : String
- lastname : String
- address : String
- email : String (unique)
- password : String
- createdAt / updatedAt : Date

🪑 **Produit**
- nom : String
- description : String
- prix : Number
- prixReduction : Number (optionnel)
- categorie : String (ex: Salon, cuisine, décoration, etc.)
- dimensions : largeur, hauteur, profondeur
- couleur : String
- materiau : String
- etat : "Neuf" ou "Occasion"
- images : liste de Strings
- quantite_disponible : Number
- vendeur_id : référence vers User
- date_ajout : Date
- valider : Boolean
- commentaires : liste de {
    utilisateur_id : référence vers User,
    nom_utilisateur : String,
    note : Number (1 à 5),
    commentaire : String,
    date : Date
  }

📦 **Commande**
- utilisateur : référence vers User
- produits : liste de {
    produit : référence vers Produit,
    quantite : Number,
    envoyer : Boolean
  }
- date : Date
- statut : String ("En attente", "Envoyée", etc.)

---

### 🧠 Règles de réponse :

- Si la question est simple (ex : “comment acheter un meuble ?”), réponds naturellement comme un assistant.(et ne roponde jamais sur les qst hors sujet par exemple c'est quoi la capital de la france)
- Si la question nécessite d’interroger la base de données, génère uniquement du code JavaScript (Mongoose/MongoDB) entre ces balises (et utilise exactement quoi il ya dans le shema psq dons certain cas il ya des buge avec le majoscule et le miniscule dans la premiere lettre par exemple la categorie Salon) (ecrire moi juste le code entre les balise et ne ajoute rien apres les balise et donner juste le reqete nesisite par exemple sous cette forme : <!-- MONGODB_QUERY_START -->
Produit.find().sort({ prix: 1 }).limit(1)
<!-- MONGODB_QUERY_END --> donc ne ajoute rien comme quoi jai envoyer exactement sans then(), sans async. Utilise uniquement des appels comme Produit.find(...), User.findOne(...), etc. N’inclus pas de console.log, ni de return, ni de promesses. on gros juste renvoyer qu'une requête MongoDB simple à la fois) 

`;


// Fonction pour sécuriser les requêtes MongoDB
const secureMongoQuery = (query) => {
  const blacklist = ['eval', 'exec', 'drop', 'delete', 'require', 'fs', 'process','update'];
  for (let bad of blacklist) {
    if (query.toLowerCase().includes(bad)) {
      throw new Error('Requête MongoDB dangereuse détectée');
    }
  }
  return query;
};

// Fonction pour exécuter une requête dans une sandbox
const executeMongoQuery = async (queryString) => {
  const context = {
    Produit: produit,
    User: userModel,
    Commande: commandeModel,
    console: console
  };

  vm.createContext(context);

  const script = new vm.Script(`(async () => await ${queryString})()`);
  return await script.runInContext(context);
};

router.post('/', async (req, res) => {
  try {
    const question = req.body.message;
    console.log("Question reçue :", question);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: `${CONTEXT}\n\nQuestion : ${question}` }]
        }
      ]
    });

    const response = result.response;
    const text = await response.text();
    console.log("Réponse AI :", text);

    if (text.includes("<!-- MONGODB_QUERY_START -->") && text.includes("<!-- MONGODB_QUERY_END -->")) {
      const query = text.split("<!-- MONGODB_QUERY_START -->")[1].split("<!-- MONGODB_QUERY_END -->")[0].trim();
    
      console.log(query);
      const secureQuery = secureMongoQuery(query);
      const dbResult = await executeMongoQuery(secureQuery);
      console.log(dbResult);
    
      if (Array.isArray(dbResult) && dbResult.length > 0) {
        if (dbResult.length > 1) {
          return res.json({
            answer: "Voici quelques produits dans cette catégorie :",
            products: dbResult.slice(0, 3) // max 3 produits
          });
        }
      
        const produit = dbResult[0];
        return res.json({
          answer: "Voici le produit trouvé :",
          products: [produit]
        });
      } else {
        return res.json({ answer: "Désolé, je n'ai trouvé aucun produit correspondant à votre demande." });
      }
    }

    res.json({ answer: text });

  } catch (error) {
    console.error("Erreur Gemini ou MongoDB :", error);
    res.status(500).json({ error: "Erreur lors de la réponse du chatbot" });
  }
});

module.exports = router;