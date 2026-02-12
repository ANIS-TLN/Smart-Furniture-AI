import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "./CartContext";
import "../componentcss/cartPanier.css";

const CartPanier = ({ produit, quantite }) => {
  const { updateCartQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={`http://localhost:5005/${produit.images[0]}`} alt={produit.nom} className="cart-item-image" />
      <div className="cart-item-info">
        <h3>{produit.nom}</h3>
        <p>{produit.description}</p>
        <p className="cart-item-price">{produit.prix} DA</p>

        <p className="cart-item-total">Total : {(produit.prix * quantite).toFixed(2)} Dz</p>


        <div className="cart-item-actions">
          <button onClick={() => updateCartQuantity(produit._id, quantite - 1)} disabled={quantite <= 1}>
            <FaMinus />
          </button>
          <span>{quantite}</span>
          <button onClick={() => updateCartQuantity(produit._id, quantite + 1)}
            disabled={quantite >= produit.quantite_disponible}>        
              <FaPlus />
          </button>
          <button onClick={() => removeFromCart(produit._id)} className="delete-button">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};


export default CartPanier;