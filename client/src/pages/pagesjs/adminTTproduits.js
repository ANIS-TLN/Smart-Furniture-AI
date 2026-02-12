import { useEffect, useState } from "react";
import { getTTProduits } from "../../api";
import ListeProduitsByID from "../../components/componentjs/ListeProduitsByID";
import Sidebar from "../../components/componentjs/Sidebar"; 
import "../pagescss/ValidationProduits.css"; 
import { FaBoxOpen } from "react-icons/fa";

const AdminTTproduits = () => {
  const [ttproduits, setttProduits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produits = await getTTProduits();
        setttProduits(produits);
      } catch (error) {
        console.error("Erreur lors du chargement des produits non validés :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="validation-produits-container">
      <Sidebar />

      <div className="validation-produits-content">
      <h1>Liste de tous les autres produits</h1>
        {ttproduits.length === 0 ? (
          <div className="no-products">
            <FaBoxOpen className="no-products-icon" />
            <p>Aucun produit trouvé.</p>
           </div>
            ) : (
            <ListeProduitsByID produits={ttproduits} setProduits={setttProduits} />
           )}
      </div>
    </div>
  );
};

export default AdminTTproduits;
