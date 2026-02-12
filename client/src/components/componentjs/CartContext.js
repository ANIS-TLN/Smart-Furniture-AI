import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getCommande, 
  addToCommande, 
  deleteFromCommande, 
  updateCommandeQuantity,
  clearCommande
} from "../../api";
import { isUserConnected } from "../../isUserConnected";

// Création du contexte du panier
const CartContext = createContext();

// Hook personnalisé pour accéder au contexte
export const useCart = () => useContext(CartContext);

// Fournisseur du contexte qui englobe l'application
export const CartProvider = ({ children }) => {
  // État du panier initialisé depuis le sessionStorage ou vide
  const [cart, setCart] = useState(() => 
    JSON.parse(sessionStorage.getItem("cart")) || []
  );

  /**
   * Fusionne les paniers local et base de données sans doublons
   * @param {Array} localCart - Panier du sessionStorage
   * @param {Array} dbCart - Panier de la base de données
   * @returns {Array} Panier fusionné
   */
  const mergeCarts = (localCart, dbCart) => {
    // Crée une copie du panier de la base de données
    const merged = [...dbCart];
    
    // Parcourt chaque élément du panier local
    localCart.forEach(localItem => {
      // Vérifie si le produit existe déjà dans le panier fusionné
      const existingIndex = merged.findIndex(
        dbItem => dbItem.produit._id === localItem.produit._id
      );
      
      if (existingIndex > -1) {
        // Si le produit existe, met à jour la quantité
        merged[existingIndex].quantite += localItem.quantite;
      } else {
        // Sinon, ajoute le nouveau produit
        merged.push(localItem);
      }
    });
    
    return merged;
  };

  /**
   * Synchronise le panier local avec la base de données
   */
  const syncCartToDatabase = async () => {
    const localCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    
    if (localCart.length > 0 && isUserConnected()) {
      try {
        // 1. Vide le panier en base pour éviter les doublons
        await clearCommande();
        
        // 2. Ajoute tous les produits du panier local à la base
        for (const item of localCart) {
          await addToCommande(item.produit._id, item.quantite);
        }
        
        // 3. Récupère le panier frais depuis la base
        const commandeData = await getCommande();
        
        if (commandeData && commandeData.produits) {
          setCart(commandeData.produits);
        }
        
        // 4. Nettoie le sessionStorage
        sessionStorage.removeItem("cart");
      } catch (error) {
        console.error("Erreur lors de la synchronisation du panier:", error);
      }
    }
  };

  // Sauvegarde automatique dans sessionStorage quand le panier change (si déconnecté)
  useEffect(() => {
    if (!isUserConnected()) {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Synchronisation du panier au montage et quand l'utilisateur se connecte
  useEffect(() => {
    const handleCartSync = async () => {
      if (isUserConnected()) {
        try {
          // 1. Récupère le panier existant en base
          const commandeData = await getCommande();
          const dbCart = commandeData?.produits || [];
          
          // 2. Récupère le panier local
          const localCart = JSON.parse(sessionStorage.getItem("cart")) || [];
          
          if (localCart.length > 0) {
            // 3. Fusionne les paniers
            const mergedCart = mergeCarts(localCart, dbCart);
            
            // 4. Met à jour la base avec le panier fusionné
            await clearCommande();
            for (const item of mergedCart) {
              await addToCommande(item.produit._id, item.quantite);
            }
            
            // 5. Met à jour l'état local
            setCart(mergedCart);
          } else if (dbCart.length > 0) {
            // Si pas de panier local, utilise celui de la base
            setCart(dbCart);
          }
          
          // Nettoie le sessionStorage
          sessionStorage.removeItem("cart");
        } catch (error) {
          console.error("Erreur lors de la synchronisation du panier:", error);
        }
      }
    };
    
    handleCartSync();
  }, []);

  /**
   * Ajoute un produit au panier
   * @param {Object} produit - Produit à ajouter
   * @param {number} quantite - Quantité (par défaut 1)
   */
  const addToCart = async (produit, quantite = 1) => {
    if (isUserConnected()) {
      // Si connecté, ajoute à la base de données
      await addToCommande(produit._id, quantite);
      
      // Met à jour l'état local
      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(p => p.produit._id === produit._id);
        if (existingIndex > -1) {
          const updated = [...prevCart];
          updated[existingIndex].quantite += quantite;
          return updated;
        }
        return [...prevCart, { produit, quantite }];
      });
    } else {
      // Si déconnecté, ajoute seulement au state local
      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(p => p.produit._id === produit._id);
        if (existingIndex > -1) {
          const updated = [...prevCart];
          updated[existingIndex].quantite += quantite;
          return updated;
        }
        return [...prevCart, { produit, quantite }];
      });
    }
  };

// Mise à jour de la quantité d'un produit
const updateCartQuantity = async (produitId, quantite) => {
  try {
    // Trouver le produit dans le panier actuel
    const produitInCart = cart.find(item => item.produit._id === produitId);
    
    if (!produitInCart) {
      throw new Error("Produit non trouvé dans le panier");
    }

    // Validation de la quantité
    if (quantite < 1) {
      throw new Error("La quantité ne peut pas être inférieure à 1");
    }

    // Vérification du stock disponible
    if (quantite > produitInCart.produit.quantite_disponible) {
      throw new Error(`Stock insuffisant. Disponible: ${produitInCart.produit.quantite_disponible}`);
    }

    // Mise à jour optimiste de l'UI
    setCart(prevCart => 
      prevCart.map(item => 
        item.produit._id === produitId 
          ? { ...item, quantite } 
          : item
      )
    );

    // Si connecté, mettre à jour le backend
    if (isUserConnected()) {
      try {
        await updateCommandeQuantity(produitId, quantite);
        
        // Optionnel: Rafraîchir les données du panier après mise à jour
        const updatedCommande = await getCommande();
        if (updatedCommande && updatedCommande.produits) {
          setCart(updatedCommande.produits);
        }
      } catch (error) {
        // En cas d'erreur du serveur, annuler la modification locale
        setCart(prevCart => 
          prevCart.map(item => 
            item.produit._id === produitId 
              ? { ...item, quantite: item.quantite } 
              : item
          )
        );
        throw error;
      }
    }

    // Notification de succès (vous pouvez utiliser un système de notification plus élaboré)
    if (quantite > produitInCart.quantite) {
      console.log(`Quantité augmentée à ${quantite}`);
    } else if (quantite < produitInCart.quantite) {
      console.log(`Quantité réduite à ${quantite}`);
    }

  } catch (error) {
    console.error("Erreur dans updateCartQuantity:", error);
    // Afficher une notification à l'utilisateur
    alert(error.message); 
    throw error;
  }
};

  /**
   * Supprime un produit du panier
   * @param {string} produitId - ID du produit à supprimer
   */
  const removeFromCart = async (produitId) => {
    try {
      if (isUserConnected()) {
        await deleteFromCommande(produitId);
        
        // Vérifier si le panier est maintenant vide et supprimer la commande si nécessaire
        const commandeData = await getCommande();
        if (commandeData && commandeData.produits && commandeData.produits.length === 0) {
          await clearCommande();
        }
      }
      
      setCart(prevCart => 
        prevCart.filter(p => p.produit._id !== produitId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      // Vous pourriez afficher une notification d'erreur ici
    }
  };

  // Valeurs exposées par le contexte
  const contextValue = {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};