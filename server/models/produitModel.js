const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  prixReduction: { type: Number},
  categorie: { type: String, required: true },
  dimensions: {
    largeur: Number,
    hauteur: Number,
    profondeur: Number
  },
  couleur: String,
  materiau: String,
  etat: { type: String, enum: ["Neuf", "Occasion"], default: "Neuf" },
  images: [String],
  quantite_disponible: { type: Number, default: 1 },
  vendeur_id: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  date_ajout: { type: Date, default: Date.now },
  valider: { type: Boolean, default: false },
  commentaires: [
    {
      utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      nom_utilisateur: String,
      note: { type: Number, min: 1, max: 5 },
      commentaire: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Produit", produitSchema);
