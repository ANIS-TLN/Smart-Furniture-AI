import { useEffect, useState } from "react";
import {
  getUser,
  updateUserInfos,
  getUserProducts,
  getUserProductsnnvalide,
} from "../../api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FaUserCircle, FaBoxOpen } from "react-icons/fa";
import { FiEdit, FiPlus } from "react-icons/fi";
import "../pagescss/ProfilAdmin.css";
import Sidebar from "../../components/componentjs/Sidebar"; // 
import ListeProduitsByID from "../../components/componentjs/ListeProduitsByID";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  nom: Yup.string().required("Nom requis").min(3),
  lastname: Yup.string().required("Prénom requis").min(2),
  address: Yup.string().required("Adresse requise").min(5),
  email: Yup.string().required("Email requis").email(),
  password: Yup.string()
    .min(6)
    .transform((value) => (value === "" ? undefined : value))
    .notRequired(),
});

export default function ProfilAdmin() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [produits, setProduits] = useState([]);
    const [produitsnnvalide, setProduitsnnvalide] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
  
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
    });
  
    useEffect(() => {
      const fetchUser = async () => {
        const userData = await getUser();
        if (userData) {
          setUser(userData);
          setValue("nom", userData.nom);
          setValue("lastname", userData.lastname);
          setValue("address", userData.address);
          setValue("email", userData.email);
          const userProducts = await getUserProducts(userData._id);
          const userProductsnnvalide = await getUserProductsnnvalide(userData._id);
          setProduits(userProducts);
          setProduitsnnvalide(userProductsnnvalide);
        }
      };
      fetchUser();
    }, [setValue]);
  
    const onSubmit = async (data) => {
      try {
        const updated = await updateUserInfos(data);
        setUser(updated);
        setMessage("Profil mis à jour !");
        setError("");
        setShowEditForm(false);
        window.alert("Vos informations ont été mises à jour avec succès !");
      } catch (err) {
        setError("Erreur lors de la mise à jour.");
        setMessage("");
      }
    };
  
    if (!user) return <p className="loading">Chargement...</p>;
  
    return (
      <div className="profil-container">
        <Sidebar /> {/* Sidebar positionné à gauche */}
        <div className="profil-main"> {/* Contenu principal avec flexbox */}
          <div className="profil-wrapper">
            <div className="profil-header">
              <div className="profil-info">
                <h2>
                  {user.nom} {user.lastname}
                </h2>
                <p>
                  {produits.length}{" "}
                  {produits.length === 1
                    ? "produit mis en vente"
                    : "produits mis en vente"}
                </p>
                <div className="profil-actions">
                  <button
                    onClick={() => setShowEditForm(true)}
                    title="Modifier mes informations "
                  >
                    <FiEdit />
                  </button>
                  <button
                    title="Ajouter un produit"
                    onClick={() => navigate("/ajoutproduit")}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>
  
            {showEditForm && (
              <form className="profil-form" onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Nom" {...register("nom")} />
                {errors.nom && <p className="error">{errors.nom.message}</p>}
                <input type="text" placeholder="Prénom" {...register("lastname")} />
                {errors.lastname && <p className="error">{errors.lastname.message}</p>}
                <input type="text" placeholder="Adresse" {...register("address")} />
                {errors.address && <p className="error">{errors.address.message}</p>}
                <input type="email" placeholder="Email" {...register("email")} />
                {errors.email && <p className="error">{errors.email.message}</p>}
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  {...register("password")}
                />
                {errors.password && <p className="error">{errors.password.message}</p>}
                <button type="submit" className="submit-btn">
                  Mettre à jour
                </button>
                {message && <p className="message">{message}</p>}
                {error && <p className="error">{error}</p>}
              </form>
            )}
  
            <div className="titre-produits">
              <h3>
                <FaBoxOpen /> Mes produits
              </h3>
            </div>
            {produits.length === 0 ? (
              <p className="no-products">Aucun produit mis en vente.</p>
            ) : (
              <ListeProduitsByID produits={produits} setProduits={setProduits} />
            )}
          </div>
        </div>
      </div>
    );
  }
  