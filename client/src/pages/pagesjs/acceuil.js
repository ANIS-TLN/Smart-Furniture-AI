import Navbar from '../../components/componentjs/navbar';
import Slider2 from '../../components/componentjs/slider2'
import Categories from '../../components/componentjs/categories' 
import ListeProduits from '../../components/componentjs/listeProduit'
import React, { useEffect, useState } from "react";
import { getProduits } from "../../api"; 
import { FaCouch,FaBoxOpen  } from "react-icons/fa";
import "../pagescss/acceuil.css"
import Chatbot from '../../Chatbot';
/*
const Container = styled.div`
  display: flex;
  align-items: center;
  height: 140px;
  background: #F5F5DC;
  border-radius: 30px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-top:30px;
   margin-bottom: 25px;
  
`;

const Titre = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(90deg, #ff8c00, #ff5e62);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  font-family: 'Times New Roman', Times, serif;
  text-align: center;

  &:hover {
    transform: scale(1.1);
  }
`;

*/

 const Acceuil=()=>{
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    const fetchProduits = async () => {
      const data = await getProduits();
      setProduits(data);
    };
    fetchProduits();
  }, []);

    return(
        <div>
         <Navbar/>
         <Slider2/>
         <div className="titre-produits">
             <h3><FaCouch /> Categories</h3>
          </div>
         <Categories/>
         <div className="titre-produits">
             <h3><FaBoxOpen /> Nos produits</h3>
          </div>
         <ListeProduits produits={produits}/>
         <Chatbot />
        </div>
    );
}




export default Acceuil;