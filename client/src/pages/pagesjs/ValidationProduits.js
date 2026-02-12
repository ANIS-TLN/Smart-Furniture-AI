import { useEffect, useState } from "react";
import { getTTProductsnnvalide } from "../../api";
import ListeProduitsByID from "../../components/componentjs/ListeProduitsByID";
import Sidebar from "../../components/componentjs/Sidebar"; 
import "../pagescss/ValidationProduits.css"; 
import { FaBoxOpen } from "react-icons/fa";

const ValidationProduits = () => {
  const [produitsnnvalide, setProduitsnnvalide] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produits = await getTTProductsnnvalide();
        setProduitsnnvalide(produits);
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
        <h1>Produits en attente de validation</h1>

        {produitsnnvalide.length === 0 ? (
          <div className="no-products">
            <FaBoxOpen className="no-products-icon" />
            <p>Aucun produit en attente de validation.</p>
           </div>
            ) : (
            <ListeProduitsByID produits={produitsnnvalide} setProduits={setProduitsnnvalide} />
           )}
      </div>
    </div>
  );
};

export default ValidationProduits;
