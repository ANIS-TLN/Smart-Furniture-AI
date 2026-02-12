import "../componentcss/listeProduit.css";
import CarteMesProduits from "./CarteMesProduits";
import { deleteProduit } from "../../api";

const ListeProduitsByID = ({ produits, setProduits }) => {

  const supprimerProduit = async (id) => {
    // Confirmation avant suppression
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const result = await deleteProduit(id);
        if (result.success) {
          // Filtre les produits pour enlever celui qui vient d'être supprimé
          setProduits(produits.filter(produit => produit._id !== id));
        } else {
          alert("Erreur lors de la suppression: " + result.message);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression");
      } finally {
      }
    }
  };

  // Fonction de validation pour le produit
  const handleValidation = (id) => {
    // Mettre à jour la liste des produits pour enlever celui qui a été validé
    setProduits(produits.filter(produit => produit._id !== id));
  };

  return (
    <div className="liste-produits">
      {
        produits.map((produit) => (
          <CarteMesProduits 
            key={produit._id} 
            produit={produit} 
            onDelete={supprimerProduit} 
            onValidate={handleValidation} // Passer la fonction de validation
          />
        ))
      }
    </div>
  );
};

export default ListeProduitsByID;
