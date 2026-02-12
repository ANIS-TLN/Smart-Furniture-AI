const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const produitRoutes = require("./routes/produitRoutes");
const userRoutes = require("./routes/userRoutes");
const commandeRoutes=require("./routes/commandeRoutes");
const chatbotRoute =require("./routes/chatbotRoute");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/produits", produitRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/commande", commandeRoutes);
app.use("/api/chatbot", chatbotRoute);



const PORT =  5005;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
