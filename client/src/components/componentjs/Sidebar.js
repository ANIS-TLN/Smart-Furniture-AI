import React from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import { FaUserCircle, FaBoxOpen, FaUsers, FaClipboardList, FaCheckCircle, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../isUserConnected";  // Import de la fonction logout
import "../componentcss/Sidebar.css";


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleAvatarClick = () => {
    navigate("/profilAdmin");
  };

  const handleLogout = () => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmation) {
      logout();
      navigate("/acceuil");
    }
  };

  return (
    <div className="sidebar">
      <div className="admin-profile">
        <div className="avatar" onClick={handleAvatarClick}>
          <FaUserCircle size={80} />
        </div>
        <p className="admin-name">Administrateur</p>
      </div>
      <ul>
        <li className={isActive("/Dashboard") ? "active" : ""}>
          <a onClick={() => navigate("/Dashboard")}>
            <FaTachometerAlt /> <span>Dashboard</span>
          </a>
        </li>
        <li className={isActive("/ValidationDesProduits") ? "active" : ""}>
          <a onClick={() => navigate("/ValidationDesProduits")}>
            <FaCheckCircle /> <span>Produits à valider</span>
          </a>
        </li>
        <li className={isActive("/tous-produits") ? "active" : ""}>
          <a onClick={() => navigate("/tous-produits")}>
            <FaBoxOpen /> <span>Tous les produits</span>
          </a>
        </li>
        <li className={isActive("/utilisateurs") ? "active" : ""}>
          <a onClick={() => navigate("/utilisateurs")}>
            <FaUsers /> <span>Utilisateurs</span>
          </a>
        </li>
        <li className={isActive("/commandes") ? "active" : ""}>
          <a onClick={() => navigate("/commandes")}>
            <FaClipboardList /> <span>Commandes</span>
          </a>
        </li>
        <li>
          <a onClick={handleLogout}>
            <FaSignOutAlt /> <span>Se déconnecter</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;