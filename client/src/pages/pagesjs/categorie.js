import React from 'react'
import ListeProduits from '../../components/componentjs/listeProduit'
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/componentjs/navbar';
import "../pagescss/categorie.css";
import { FaCouch,FaBoxOpen  } from "react-icons/fa";

const Categorie = () => {
    const location = useLocation();
    const produitsCategorie = location.state?.produits || [];
    const categorieNom = location.state?.categorie 
    
    return (
       <div>
          <Navbar/>
          <div className="titre-produits">
                       <h3><FaCouch />{categorieNom}</h3>
          </div>
          
           <ListeProduits produits={produitsCategorie}/>
        </div>
   

  )
}

export default Categorie




