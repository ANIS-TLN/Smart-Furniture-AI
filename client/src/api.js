import axios from "axios";
 

const API_URL = "http://localhost:5005/api"; 

//  Création de l'instance Axios avec la configuration
const api = axios.create({
  baseURL: API_URL, // Base URL du backend
  headers: {
    "Content-Type": "application/json",
  },
});


//  Ajout automatique du token à chaque requête si disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupère le token
    console.log("Token récupéré :", token); 

    if (token) {
      //Lorsqu'une requête est envoyée au serveur, on vérifie si un token est présent
      //S'il existe, on l'ajoute dans les headers HTTP sous la forme
      config.headers.Authorization = `Bearer ${token}`; // Ajoute le token dans l'en-tête
      console.log("Token ajouté aux headers :", config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Fonction pour rechercher des produits
export const searchProducts = async (query) => {
  try {
    const response = await api.get("/produits/recherche", {
      params: { q: query }, // GET http://localhost:5005/api/produits/recherche?q=canapé
    });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la recherche des produits :", error);
    return []; 
  }
};

//  Obtenir tous les produits d'un administrateur
export const getProduits = async () => {
    try {
      const response = await api.get("/produits"); // Utilisation de api au lieu de axios
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return [];
    }
  };




  //  Obtenir tous les produits d'un administrateur
export const getTTProduits = async () => {
  try {
    const response = await api.get("/produits/all"); // Utilisation de api au lieu de axios
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
};

//  Fonction pour récupérer les produits selon la catégorie
export const getPruduitcategorie = async (query) => {
  try {
    const response = await api.get("/produits/categorie", { // Correction de l'URL
      params: { q: query }, // GET http://localhost:5005/api/produits/categorie?q=salon
    });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la recherche des produits :", error);
    return []; 
  }
};

//  Fonction pour récupérer l'utilisateur connecté
export const getUser = async () => {
  try {
    const response = await api.get("/auth/user");
    return response.data;
  } catch (error) {
    console.error("Erreur getUser :", error.response?.data || error.message);
    return null;
  }
};

//  Fonction pour s'inscrire
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    // Vérifie si l'utilisateur a été créé avec succès
    if (response.data.user) {
      return response.data; // Retourne les détails de l'utilisateur créé
    } else {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return { error: true, message: error.response.data.message }; //  ici on retourne le vrai message
    } else {
      return { error: true, message: "Erreur inconnue" };
    }
  }
};


//  Fonction pour se connecter
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    // Vérifie si la réponse contient un token valide et un utilisateur
    if (response.data.token && response.data.user) {
      // Stocker le token et les informations de l'utilisateur dans localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userid", response.data.user._id);
      localStorage.setItem("username", response.data.user.nom);
      localStorage.setItem("userlastname", response.data.user.lastname);
      localStorage.setItem("useremail", response.data.user.email);
      localStorage.setItem("useraddress", response.data.user.address);

      return response.data;
    } else {
      throw new Error("Réponse inattendue du serveur");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return null;
  }
};











// Fonction pour ajouter un commentaire
export const ajouterCommentaire = async (produitId, commentaire, note) => {
  try {
    const response = await api.post(`/produits/${produitId}/comment`, { commentaire, note });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Erreur serveur" };
  }
};




//// avoir le nom du vendeur du produit a partir de son id 
export const getVendeur = async (vendeurId) => {
  try {
    const response = await api.get(`/auth/${vendeurId}`);
    return response.data; // Retourne directement les données du vendeur
  } catch (error) {
    console.error("Erreur lors de la récupération du vendeur", error);
    return null;
  }
};




//  Récupérer le panier (commande) en base de données
export const getCommande = async () => {
  try {
    const response = await api.get("/commande");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du panier :", error);
    return { produits: [] };
  }
};
export const getAllCommandes = async () => {
  const response = await api.get("/commande/commande");
  return response.data;
};


export const addToCommande = async (produitId, quantite) => {
  try {
    console.log("Envoi de la requête d'ajout au panier :", { produitId, quantite });
    const response = await api.post("/commande/ajouter", { produitId, quantite });
    console.log("Réponse du serveur :", response.data);
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error.response?.data || error.message);
  }
};







// Mettre à jour la quantité d'un produit dans le panier
export const updateCommandeQuantity = async (produitId, quantite) => {
  try {
    // Validation approfondie des données
    if (!produitId || typeof produitId !== 'string') {
      throw new Error("ID produit invalide");
    }

    if (quantite === undefined || quantite === null || isNaN(quantite)) {
      throw new Error("Quantité non valide");
    }

    quantite = Number(quantite);
    
    if (quantite < 1) {
      throw new Error("La quantité doit être d'au moins 1");
    }

    // Préparation des données pour la requête
    const requestData = {
      produitId,
      quantite
    };

    console.log("Envoi de la requête de mise à jour quantité:", requestData);

    const response = await api.put("/commande/modifier", requestData);

    // Vérification de la réponse du serveur
    if (!response.data) {
      throw new Error("Réponse vide du serveur");
    }

    console.log("Réponse reçue:", response.data);

    // Gestion des erreurs spécifiques du backend
    if (response.data.success === false) {
      const errorMessage = response.data.message || "Échec de la mise à jour de la quantité";
      
      if (response.data.code === "STOCK_INSUFFISANT") {
        throw new Error(`Stock insuffisant. ${response.data.stockDisponible ? `Seulement ${response.data.stockDisponible} disponible(s)` : ''}`);
      }
      
      throw new Error(errorMessage);
    }

    return {
      success: true,
      message: response.data.message || "Quantité mise à jour avec succès",
      commande: response.data.commande,
      stockDisponible: response.data.stockDisponible
    };

  } catch (error) {
    console.error("Erreur détaillée dans updateCommandeQuantity:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });

    // Traduction des erreurs HTTP en messages utilisateur
    let errorMessage = error.message;
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Requête incorrecte. Vérifiez les données envoyées.";
          break;
        case 401:
          errorMessage = "Authentification requise. Veuillez vous reconnecter.";
          break;
        case 404:
          errorMessage = "Produit ou commande introuvable.";
          break;
        case 409:
          errorMessage = "Conflit de données. Veuillez rafraîchir la page.";
          break;
        case 500:
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
          break;
      }

      // Si le backend fournit un message détaillé
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }

    throw new Error(errorMessage);
  }
};

// Supprimer un produit du panier
export const deleteFromCommande = async (produitId) => {
  try {
    const response = await api.delete(`/commande/supprimer/${produitId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    throw error;
  }
};

// Vider complètement le panier
export const clearCommande = async () => {
  try {
    await api.delete("/commande/vider");
  } catch (error) {
    console.error("Erreur lors de la suppression du panier :", error);
  }
};


export const updateUserInfos = async (userData) => {
  try {
    const response = await api.put("/auth/update", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};




// Fonction pour récupérer les produits d'un utilisateur avec le nombre de ventes
export const  getUserProducts= async (userId) => {
  try {

    const response = await api.get(`/produits/user/${userId}`);
    return response.data; // Retourne la liste des produits avec les ventes
  } catch (error) {
    console.error("Erreur lors de la récupération des produits avec ventes:", error);
    throw error; 
  }
};

// Fonction pour récupérer les produits d'un utilisateur avec le nombre de ventes
export const  getUserProductsnnvalide= async (userId) => {
  try {

    const response = await api.get(`/produits/nnvalide/user/${userId}`);
    return response.data; // Retourne la liste des produits avec les ventes
  } catch (error) {
    console.error("Erreur lors de la récupération des produits avec ventes:", error);
    throw error; 
  }
};




// Fonction pour récupérer tt les  produits nn valide
export const  getTTProductsnnvalide= async (userId) => {
  try {

    const response = await api.get(`/produits/nnvalide/user`);
    return response.data; // Retourne la liste des produits avec les ventes
  } catch (error) {
    console.error("Erreur lors de la récupération des produits avec ventes:", error);
    throw error; 
  }
};


// Fonction pour ajouter un produit
export const addProduit = async (formData) => {  // Accepte directement FormData
  try {
    const response = await api.post("/produits", formData, {
      headers: {
        "Content-Type": "multipart/form-data",  
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur API addProduit:", error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer les produits d'un vendeur spécifique
export const getProduitsByVendeur = async (vendeurId) => {
  try {
    const response = await api.get(`/produits/vendeur/${vendeurId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits du vendeur:", error);
    return [];
  }
};

// Fonction pour supprimer un produit
export const deleteProduit = async (produitId) => {
  try {
    const response = await api.delete(`/produits/${produitId}`);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return { success: false, message: error.response?.data?.message || "Erreur serveur" };
  }
};

export const updateProduit = async (produitId, formData) => {
  try {
    const response = await api.put(`/produits/${produitId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur API updateProduit:", error.response?.data || error.message);
    throw error;
  }
};



//dasbord

export const  getProduitsAValider= async () => {
  try {

    const response = await api.get(`/produits/pro/stats`);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des produits avec ventes:", error);
    throw error; 
  }
};

export const  getCommandeenattente= async () => {
  try {

    const response = await api.get(`/commande/com/stats`);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des produits avec ventes:", error);
    throw error; 
  }
};

export const  getTotalUtilisateurs= async () => {
  try {

    const response = await api.get(`/auth/aut/stats`);
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération des produits avec ventes:", error);
    throw error; 
  }
};

export const  validerProduit= async (id) => {
  try {
    const res = await api.put(`/produits/valider/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur validation produit :", error);
    throw error;
  }
};







// Fonction pour confirmer une commande
export const confirmCommande = async (commandeId) => {
  try {
    const response = await api.post("/commande/confirmer", { // Notez le "es" à commandes
      commandeId
    });
    return response.data;
  } catch (error) {
    console.error("Erreur API confirmCommande:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};



// Récupérer les commandes confirmées/envoyées d'un utilisateur
export const getCommandesConfirmees = async () => {
  try {
    console.log("Tentative de récupération des commandes confirmées"); // Debug
    const response = await api.get("/commande/cmdconfirmer");
    console.log("Réponse reçue:", response.data); // Debug
    return response.data;
  } catch (error) {
    console.error("Erreur complète:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return [];
  }
};



// Récupérer les commandes confirmées/envoyées d'un utilisateur
export const getCommandesConfirmeesvendeur = async () => {
  try {
    console.log("Tentative de récupération des commandes confirmées"); // Debug
    const response = await api.get("/commande/cmdconfirmervendeur");
    console.log("Réponse reçue:", response.data); // Debug
    return response.data;
  } catch (error) {
    console.error("Erreur complète:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return [];
  }
};


// produit envoyer(livre ) d'une commande
export const marquerProduitEnvoye = async (commandeId, produitId) => {
  try {
    const response = await api.put(`/commande/produit/envoyer/${commandeId}/${produitId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du marquage du produit comme envoyé:", error);
    throw error;
  }
};





