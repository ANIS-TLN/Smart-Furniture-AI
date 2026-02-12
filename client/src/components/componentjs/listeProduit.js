import React from "react";
import Produit from "./produit";
import "../componentcss/listeProduit.css";
import { FaBoxOpen } from "react-icons/fa"; // Icône vide

const ListeProduits = ({ produits }) => {
  return (
    <div className="liste-produits">
      {produits.length > 0 ? (
        produits.map((produit) => <Produit key={produit._id} produit={produit} />)
      ) : (
        <div className="no-produits">
          <FaBoxOpen className="no-produits-icon" />
          <p>Aucun produit disponible.</p>
        </div>
      )}
    </div>
  );
};

export default ListeProduits;
