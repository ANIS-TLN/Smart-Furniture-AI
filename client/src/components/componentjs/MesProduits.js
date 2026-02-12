import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { getProduitsByVendeur } from "../../api";
import Loader from "./Loader";
import ListeProduitsByID from "./ListeProduitsByID";
import "../componentcss/MesProduits.css";
export default function MesProduits() {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        //a modifier
        //const vendeurId = localStorage.getItem("userid");
        const vendeurId = "67d55b2cc14a211ded9e2402"; // pour tester
        if (vendeurId) {
          const data = await getProduitsByVendeur(vendeurId);
          setProduits(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
      }
    };

    fetchProduits();
  }, []);

  return (
    <>
      <Navbar />
      <Loader>
        <div className="mes-produits-container">
          <h1>Mes Produits</h1>
          <div style={{height:40}}></div>
          {produits.length > 0 ? (
            <ListeProduitsByID produits={produits} setProduits={setProduits} />
          ) : (
            <p className="paragraph">Vous n'avez aucun produit en vente pour le moment.</p>
          )}
        </div>
      </Loader>
    </>
  );
}