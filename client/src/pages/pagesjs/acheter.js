import React, { useEffect, useState } from "react";
import Navbar from "../../components/componentjs/navbar";
import { getCommandesConfirmees } from "../../api"; 
import "../pagescss/acheter.css";
import {FaShoppingBag } from "react-icons/fa";
export const Acheter = () => {
  const [commandes, setCommandes] = useState([]);
  const userId = localStorage.userid;

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        // Récupère toutes les commandes confirmées/envoyées
        const toutesCommandes = await getCommandesConfirmees();
        
        // Filtre pour ne garder que celles de l'utilisateur connecté
        const userCommandes = toutesCommandes.filter(
          commande => commande.utilisateur === userId
        );
        
        setCommandes(userCommandes);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      }
    };
    
    fetchCommandes();
  }, [userId]);

  return (
    <div>
      <Navbar />
      <div className="acheter-container">
        
        {commandes.length === 0 ? (
                <div className="panier-vide-container">
                  <FaShoppingBag size={100} className="panier-vide-icon" />
                  <p className="panier-vide-message"> Vous n'avez aucune commande confirmée ou envoyée pour le moment </p>
                </div>
        ) : (
          <>
          <h2>Mes Commandes</h2>
          {commandes.map((commande) => (
            <div key={commande._id} className="commande-card">
              <h3>Commande #{commande._id.slice(-6).toUpperCase()}</h3>
              <p>Statut : {commande.statut}</p>
              {commande.dateConfirmation && (
                <p>Date : {new Date(commande.dateConfirmation).toLocaleDateString()}</p>
              )}
              <ul>
                {commande.produits.map((p, i) => (
                  <li key={i}>
                    {p.produit?.nom} - Quantité : {p.quantite} - Prix : {(p.produit?.prix || 0) * p.quantite} DA
                  </li>
                ))}
              </ul>
              <p className="total">
                Total : {commande.produits.reduce(
                  (acc, p) => acc + (p.produit?.prix || 0) * p.quantite, 
                  0
                )} DA
              </p>
            </div>
          ))}
          </>
        )}
      </div>
    </div>
  );
};