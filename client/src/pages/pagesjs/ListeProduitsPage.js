import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ListeProduits from "../../components/componentjs/listeProduit";
import { searchProducts } from "../../api"; 
import Navbar from "../../components/componentjs/navbar";
import "../pagescss/categorie.css";

const ListeProduitsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery.trim() === "") return; // Si la requête est vide, ne rien faire

    const fetchProduits = async () => {
      setLoading(true);
      const data = await searchProducts(searchQuery);
      setProduits(data);
      setLoading(false);
    };

    fetchProduits();
  }, [searchQuery]);

  return (
    <div>
      <Navbar/>
      <h2 className="categorie-titre">Résultats pour : "{searchQuery}"</h2>
      {loading ? <p>Chargement...</p> : 
      <ListeProduits produits={produits} />}
    </div>
  );
};

export default ListeProduitsPage;

