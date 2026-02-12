import React from "react";
import { useCart } from "./CartContext"; // Accès au contexte du panier
import CartPanier from "./cartPanier"; // Composant pour afficher chaque produit du panier
import "../componentcss/cartPanierListe.css"; // Fichier de style CSS
import { MdRemoveShoppingCart } from "react-icons/md"; // Icône pour panier vide
import { useNavigate } from "react-router-dom"; // Pour rediriger vers d'autres pages
import { isUserConnected } from "../../isUserConnected"; // Vérifie si l'utilisateur est connecté
import { getCommande } from '../../api'; // Importez la fonction getCommande

const CartPanierListe = () => {
  const { cart } = useCart(); // Récupère le panier via le contexte
  const navigate = useNavigate(); // Hook de navigation
  const userId = localStorage.userid; // Récupère l'ID utilisateur
  const [commandeStatus, setCommandeStatus] = React.useState(""); // État pour stocker le statut de la commande

  // Fonction pour récupérer et stocker l'ID de commande et vérifier son statut
  const fetchAndStoreCommandeId = async () => {
    try {
      const commandeData = await getCommande();
      if (commandeData._id) {
        localStorage.setItem('currentCommandeId', commandeData._id);
        setCommandeStatus(commandeData.statut); // Stocke le statut de la commande
      }
    } catch (error) {
      console.error("Erreur récupération commande:", error);
    }
  };

  // Calcul du total du panier
  const totalPanier = cart.reduce(
    (acc, item) => acc + item.produit.prix * item.quantite,
    0
  );

  // Fonction appelée lorsqu'on clique sur "Passer la commande"
  const handlePasserCommande = async () => {
    if (isUserConnected()) {
      // Si l'utilisateur est connecté, on l'envoie à la page de paiement
      const userFirstname = localStorage.getItem("username") || "";
      const userLastname = localStorage.getItem("userlastname") || "";
      const userAddress = localStorage.getItem("useraddress") || "";
      const commandeId = localStorage.getItem('currentCommandeId');

      // Préparer les infos de la commande
      const commande = {
        _id: commandeId,
        produits: cart,
        total: totalPanier.toFixed(2),
        firstname: userFirstname,
        lastname: userLastname,
        address: userAddress,
      };
      console.log("Commande envoyée vers checkout :", commande);
      navigate("/checkout", { state: { commande } });
    } else {
      // Sinon, on lui demande de se connecter
      const confirmRedirect = window.confirm("Veuillez vous connecter pour passer la commande.");
      if (confirmRedirect) {
        navigate("/login");
      }
    }
  };

  // Vérifie si des produits sont en statut "En Attente"
  const hasPendingProducts = cart.some(item => item.produit.statut === "En Attente");

  // Appel au chargement du composant
  React.useEffect(() => {
    if (isUserConnected()) {
      fetchAndStoreCommandeId();
    }
  }, []);

  // Si le panier est vide OU si la commande n'est pas "En attente", afficher un message
  if (cart.length === 0 || (commandeStatus && commandeStatus !== "En attente")) {
    return (
      <div className="panier-vide-container">
        <MdRemoveShoppingCart size={100} className="panier-vide-icon" />
        <p className="panier-vide-message"> Votre panier est vide </p>
      </div>
    );
  }

  // Si le panier contient des produits avec statut "En attente", les afficher
  return (
    <div className="containerrr mx-auto p-4">
      <h1 className="titre-panier">Mon Panier</h1>
      
      {/* Section d'information si des produits sont en attente de validation */}
      {hasPendingProducts && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Certains produits sont en attente de validation par le vendeur</p>
        </div>
      )}

      {/* Affichage de chaque produit dans le panier */}
      <div className="space-y-4">
        {cart.map((item) => (
          <CartPanier
            key={item.produit._id}
            produit={item.produit}
            quantite={item.quantite}
          />
        ))}
      </div>

      {/* Affichage du total + bouton "Passer la commande" */}
      <div className="total-panier">
        <h2 className="text-xl font-bold">
          Total : {totalPanier.toFixed(2)} Dz
        </h2>

        <button 
          onClick={handlePasserCommande} 
          className="passer-commande-button mt-4"
          disabled={hasPendingProducts} // Désactive le bouton si produits en attente
        >
          Passer la commande 💳
          {hasPendingProducts && (
            <span className="text-sm block mt-1 text-red-500">
              (Non disponible pour produits en attente)
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartPanierListe;

