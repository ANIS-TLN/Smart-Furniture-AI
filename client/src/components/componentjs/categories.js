import React from "react";
import { useState } from "react"; 
import "../componentcss/categories.css";
import { useNavigate } from "react-router-dom"; 
import { getPruduitcategorie } from "../../api"; 

const categories = [
  { image: "/images/salon2.jpg", titre: "Salon" },
  { image: "/images/cuisine2.jpg", titre: "Cuisine" },
  { image: "/images/salledebain2.jpg", titre: "Salle de bains" },
  { image: "/images/rangement2.jpg", titre: "Rangement" },
  { image: "/images/exterieur2.jpg", titre: "Exterieur" },
  { image: "/images/chambre2.jpg", titre: "Chambre" },
  { image: "/images/bureau2.jpg", titre: "Bureau" },
  { image: "/images/decooo.jpg", titre: "Decoration" }
];

const Categories = () => {
  const navigate = useNavigate();
  
  

  const fetchProduits = async (categorie) => {
    const data = await getPruduitcategorie(categorie);
    console.log("Produits récupérés :", data);
    return data;
  };

  const handleClick = async (categorieTitre) => {
    const produitsCategorie = await fetchProduits(categorieTitre); 
    navigate("/categorie", { state: { produits: produitsCategorie,categorie: categorieTitre  } });
  };
  
  

  return (
    <div className="categories-conteneur">
      
      <div className="ligne">
        {categories.slice(0, 3).map((categorie, index) => (
          <div key={index} className="categorie">
            <img src={categorie.image} alt={categorie.titre} />
            <div className="overlay">
              <h2>{categorie.titre}</h2>
              <button onClick={() => handleClick(categorie.titre)}>Découvrir</button>
            </div>
          </div>
        ))}
      </div>


      <div className="ligne1">
        {categories.slice(3, 5).map((categorie, index) => (
          <div key={index} className="categorie">
            <img src={categorie.image} alt={categorie.titre} />
            <div className="overlay">
              <h2>{categorie.titre}</h2>
              <button onClick={() => handleClick(categorie.titre)}>Découvrir</button>
            </div>
          </div>
        ))}
      </div>

      
      <div className="ligne">
         {categories.slice(5, 8).map((categorie, index) => (
             <div key={index} className="categorie">
               <img src={categorie.image} alt={categorie.titre} />
               <div className="overlay">
                  <h2>{categorie.titre}</h2>
                  <button onClick={() => handleClick(categorie.titre)}>Découvrir</button>
                </div>
            </div>
             ))}
      </div>

      {/*categories[7] && (
        <div className="ligne1">
          <div className="categorie ">
            <img src={categories[7].image} alt={categories[7].titre} />
            <div className="overlay">
               <h2>{categories[7].titre}</h2>
               <button onClick={() => handleClick(categories[7].titre)}>Découvrir</button>
           </div>
          </div>
        </div>
)*/}


    </div>
  );
};

export default Categories