import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaShoppingCart, FaSearch, FaShoppingBag } from "react-icons/fa";
import axios from "axios";
import "../componentcss/navbar.css";
import { searchProducts, registerUser, loginUser } from "../../api";
import { isUserConnected, logout } from "../../isUserConnected";
import { useCart } from "./CartContext";


const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { cart } = useCart() || { cart: [] }; //  Ajout d'une valeur par défaut pour éviter l'erreur
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Calcul du nombre total d'articles dans le panier
  useEffect(() => {
    if (isUserConnected()) {
      // Si connecté, on compte les articles du panier local + ceux de la commande en attente
      const count = cart.reduce((sum, item) => sum + (item.quantite || 0), 0);
      setCartItemsCount(count);
    } else {
      // Si déconnecté, on compte seulement les articles du panier local
      const count = cart.reduce((sum, item) => sum + (item.quantite || 0), 0);
      setCartItemsCount(count);
    }
  }, [cart]);

  // Gestion de la recherche
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      const data = await searchProducts(query);
      setResults(data);
    };

    fetchResults();
  }, [query]);


   // Fonction pour gérer la déconnexion
    const handleLogout = () => {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
      if (confirmation) {
        logout();  // Appel à la fonction logout
        navigate("/acceuil"); 
      }
    };
  

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <div className="navbar-left">
          <Link to="/acceuil" className="navbar-logo">
            FurnishUp
          </Link>
        </div>

        <div className="navbar-center">
          <form
            className="search-container"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (query.trim() !== "") {
                    navigate(`/ListeProduitsPage?q=${query}`);
                    setResults([]); // Réinitialise les résultats après la redirection
                  }
                }
              }}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </form>
          {/* Affichage des résultats de recherche */}
          {/************************************************************************************************************************ */}
          {query.trim() !== "" && (
            <div className="search-results">
              {results.length > 0 ? (
                results.map((product) => (
                  <div key={product._id} className="search-item" onClick={() => { navigate("/details", { state: product }); setQuery(""); setResults([]) }}>
                    <Link to={`/produit/${product._id}`} className="search-link">
                      <img
                        src={`http://localhost:5005/${product.images[0]}`}
                        alt={product.nom}
                        className="cart-item-image"
                      />
                      <div className="search-text">
                        <p>{product.nom}</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ color: "black", fontWeight: "bold" }}>Produit n'existe pas</p>
              )}
            </div>
          )}
        </div>

        <div className="navbar-right">
          <Link to="/acceuil" className="icon-link">
            <FaHome />
          </Link>
           <div className="cart-icon-container">
            <Link to="/panier" className="icon-link">
              <FaShoppingCart />
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>
          </div>
          {isUserConnected() && (
            <Link to="/acheter" className="icon-link">
            <FaShoppingBag />
          </Link>
          )}
          {isUserConnected() ? (
            <div className="user-menu" ref={dropdownRef}>
              <FaUser
                className="icon-link"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profil" className="dropdown-item">
                    mon profil
                  </Link>
                  <button className="button" onClick={handleLogout}>Se deconnecter</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="user-menu" ref={dropdownRef}>
                <FaUser
                  className="icon-link"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/login" className="dropdown-item">
                      Se connecter
                    </Link>
                    <Link to="/inscription" className="dropdown-item">
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;