const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    lastname:{ type: String, required: true },
    address:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true } // Ajoute automatiquement createdAt et updatedAt
);

module.exports = mongoose.model("User", UserSchema);
