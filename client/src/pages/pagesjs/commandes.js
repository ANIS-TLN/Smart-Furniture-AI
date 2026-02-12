import React, { useEffect, useState } from "react";
import Navbar from "../../components/componentjs/navbar";
import { getCommandesConfirmeesvendeur, marquerProduitEnvoye } from "../../api";
import "../pagescss/commandes.css";

export const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.userid;

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const toutesCommandes = await getCommandesConfirmeesvendeur();

      const commandesFiltrees = toutesCommandes.filter(commande => {
        return commande.produits.some(
          p => p.produit?.vendeur_id?._id?.toString() === userId
        );
      });

      const commandesAvecProduitsVendeur = commandesFiltrees.map(commande => {
        const produitsVendeur = commande.produits.filter(
          p => p.produit?.vendeur_id?._id?.toString() === userId
        );

        return {
          ...commande,
          produitsVendeur,
          totalVendeur: produitsVendeur.reduce(
            (acc, p) => acc + (p.produit?.prix || 0) * p.quantite,
            0
          )
        };
      });

      setCommandes(commandesAvecProduitsVendeur);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, [userId]);

  const handleMarquerEnvoye = async (commandeId, produitId) => {
    try {
      await marquerProduitEnvoye(commandeId, produitId);
      // Recharger les commandes après la mise à jour
      await fetchCommandes();
    } catch (error) {
      console.error("Erreur lors du marquage du produit comme envoyé:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="commandes-container">
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="commandes-container">
        <h2>Mes Ventes</h2>
        {commandes.length === 0 ? (
          <p>Aucune commande confirmée pour vos produits.</p>
        ) : (
          commandes.map((commande) => (
            <div key={commande._id} className="commande-card">
              <div className="commande-header">
                <h3>Commande #{commande._id.slice(-6).toUpperCase()}</h3>
                <div className="commande-info">
                  <p><strong>Date:</strong> {new Date(commande.date).toLocaleDateString()}</p>
                  <p><strong>Client:</strong> {commande.utilisateur?.nom} {commande.utilisateur?.prenom}</p>
                </div>
              </div>

              <ul className="produits-list">
                {commande.produitsVendeur.map((p, i) => (
                  <li key={i} className="produit-item">
                    <div className="produit-info">
                      <h4>Produits à livrer : {p.produit?.nom || 'Produit inconnu'}</h4>
                      <span className="produit-quantite">Quantité: {p.quantite}</span>
                      <span className="produit-prix">Prix unitaire: {p.produit?.prix || 0} DA</span>
                    </div>

                    <div className="produit-total">
                      <div className="produit-actions">
                        {!p.envoyer ? (
                          <button
                            onClick={() => handleMarquerEnvoye(commande._id, p.produit?._id)}
                            className="envoyer-btn"
                          >
                            Marquer comme envoyé
                          </button>
                        ) : (
                          <span className="envoye-badge">✔ Envoyé</span>
                        )}
                      </div>
                      <div className="produit-prix-total">
                        Total: {(p.produit?.prix || 0) * p.quantite} DA
                      </div>
                    </div>


                  </li>

                ))}
              </ul>


            </div>
          ))
        )}
      </div>
    </div>
  );
};