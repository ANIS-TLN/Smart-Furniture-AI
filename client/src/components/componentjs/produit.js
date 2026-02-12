import React from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import "../componentcss/produit.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.js";

const Produit = ({ produit }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart() || { addToCart: () => {} };
  return (
    <div className="produit-container">
      <div className="produit-image-container">
        <img
          src={`http://localhost:5005/${produit.images[0]}`}
          alt={produit.nom}
          className="produit-image"
        />
        <div className="produit-hover">
          <p className="produit-nomcc">{produit.nom}</p>
          <div className="price-containera">
            {produit.prixReduction && (
              <span className="prix-originale">{produit.prixReduction} DA</span>
            )}
            <p className="produit-prixcc">{produit.prix} DA</p>
          </div>
          <div className="icons">
            <FaShoppingCart
              className="icon"
              onClick={() => {
                addToCart(produit);
                !produit
                  ? alert(`${produit.nom} non disponible`)
                  : alert(`${produit.nom} a été ajouté au panier`);
              }}
            />
            <FaSearch
              className="icon"
              onClick={() => navigate("/details", { state: produit })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produit;