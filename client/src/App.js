import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Acceuil from './pages/pagesjs/acceuil';
import Resultats from './pages/pagesjs/resultats';
import DetailsProduit from './pages/pagesjs/detailsProduit.js'; 
import Categorie from './pages/pagesjs/categorie.js'; 
import Profil from "./pages/pagesjs/profil.js";
import { Panier } from "./pages/pagesjs/panier.js";
import ListeProduitsPage from "./pages/pagesjs/ListeProduitsPage.js";
import Login from "./pages/pagesjs/login.js";
import Inscription from "./pages/pagesjs/inscription.js";
import AjoutProduit from "./components/componentjs/AjoutProduit.js";
import ModifierProduit from "./pages/pagesjs/ModifierProduit.js";
import Dashboard from "./pages/pagesjs/Dashboard.js";
import ValidationProduits from "./pages/pagesjs/ValidationProduits.js";
import ProfilAdmin from "./pages/pagesjs/ProfilAdmin.js";
import AdminTTproduits from "./pages/pagesjs/adminTTproduits.js";
import Checkout from "./components/componentjs/Checkout.js";
import { Acheter } from "./pages/pagesjs/acheter.js";
import { Commandes } from "./pages/pagesjs/commandes.js";





function App() {
  return (
    <Router>  
    <Routes>
    
      <Route path="/" element={<Acceuil />} />
      <Route path="/acceuil" element={<Acceuil />} />
      <Route path="/resultats" element={<Resultats/>} />
      <Route path="/details" element={<DetailsProduit />} />
      <Route path="/categorie" element={<Categorie />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="/ListeProduitsPage" element={<ListeProduitsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/ajoutproduit" element={<AjoutProduit />} />
      <Route path="/modifier/:id" element={<ModifierProduit />} />
      <Route path="Dashboard" element={<Dashboard />} />
      <Route path="ValidationDesProduits" element={<ValidationProduits />} />
      <Route path="ProfilAdmin" element={<ProfilAdmin />} />
      <Route path="tous-produits" element={<AdminTTproduits />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/acheter" element={<Acheter />} />
      <Route path="/commandes" element={<Commandes />} />
     </Routes>

  </Router>
  );
}

export default App;


