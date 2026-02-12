const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Meubles", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connecté !");
  } catch (error) {
    console.error(" Erreur de connexion à MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
