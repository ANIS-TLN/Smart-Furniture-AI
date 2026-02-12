
const mongoose = require("mongoose");
const commandeSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  produits: [
    {
      produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
      quantite: { type: Number, required: true, default: 1 },
      envoyer: { type: Boolean, default: false }, // Ajoute ce champ
    },
  ],
  date: { type: Date, default: Date.now },
  statut: { type: String, default: "En attente" },
});
module.exports = mongoose.model("Commande", commandeSchema);

