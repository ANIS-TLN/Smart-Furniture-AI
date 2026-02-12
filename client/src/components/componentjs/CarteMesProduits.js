import React from "react";
import { FaTrash, FaEdit, FaSearch, FaCheck } from "react-icons/fa";
import "../componentcss/CarteMesProduits.css";
import { useNavigate } from "react-router-dom";
import { validerProduit } from "../../api";  // Importer la fonction pour valider le produit

const CarteMesProduits = ({ produit, onDelete, onValidate }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");  // Récupérer l'ID de l'utilisateur
  const isAdmin = userId === "67d58664c14a211ded9e25ed";  // Vérifier si l'utilisateur est admin
  const isVendeur = userId === produit.vendeur_id;  // Vérifier si l'utilisateur est le vendeur du produit

  const handleValidation = async () => {
    try {
      const response = await validerProduit(produit._id);
      if (response.message === "Produit validé avec succès") {
        // Appeler la fonction passée depuis ListeProduitsByID pour retirer ce produit de la liste
        onValidate(produit._id);
        alert("Produit validé avec succès !");
      } else {
        alert("Échec de la validation du produit.");
      }
    } catch (error) {
      alert("Une erreur s'est produite lors de la validation du produit.");
      console.error("Erreur lors de la validation :", error);
    }
  };

  return (
    <div className="card-container">
      {/* Côté gauche - Image */}
      <div className="card-image-container">
        <img
          src={`http://localhost:5005/${produit.images[0]}`}
          alt={produit.nom}
          className="card-image"
        />
      </div>

      {/* Côté droit - Informations */}
      <div className="card-info-container">
        <h3 className="card-title">{produit.nom}</h3>
        <p className="card-description">{produit.description}</p>

        <div className="card-details">
          <span className="card-price">{produit.prix} DA</span>
          {produit.prixReduction && (
            <span className="card-original-price">
              {produit.prixReduction} DA
            </span>
          )}
          <span className="card-category">{produit.categorie}</span>
          <span className="card-category">{produit.etat}</span>
        </div>

        {/* Boutons Modifier */}
        <div className="card-actions">
  {isAdmin && !isVendeur && produit.valider === false ? (
    <>
      {/* Bouton Valider */}
      <button
        className="card-validate-btn"
        onClick={handleValidation}
        title="Valider le produit"
      >
        <FaCheck />
      </button>
    </>
  ) : null}

  {isVendeur ? (
    <>
      {/* Bouton Modifier */}
      <button
        className="card-edit-btn"
        onClick={() => navigate(`/modifier/${produit._id}`, { state: { produit } })}
        title="Modifier"
      >
        <FaEdit />
      </button>
    </>
  ) : null}

  {/* Bouton Supprimer */}
  <button
    className="card-delete-btn"
    onClick={() => onDelete(produit._id)}
    title="Supprimer"
  >
    <FaTrash />
  </button>

  {/* Bouton Détail */}
  <button
    className="card-detailler-btn"
    onClick={() => navigate("/details", { state: produit })}
    title="Voir plus de détails"
  >
    <FaSearch />
  </button>
</div>
      </div>
    </div>
  );
};

export default CarteMesProduits;
