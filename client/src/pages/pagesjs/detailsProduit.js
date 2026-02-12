import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../pagescss/detailsproduit.css";
import Navbar from '../../components/componentjs/navbar';
import { isUserConnected } from "../../isUserConnected";
import { ajouterCommentaire, getVendeur, deleteProduit, validerProduit } from "../../api";
import { useCart } from "../../components/componentjs/CartContext";

const DetailsProduit = () => {
  //  Récupération du produit depuis la route précédente
  const location = useLocation();
  const produit = location.state;

  //  États pour les commentaires, images et infos du vendeur
  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState(5);
  const [vendeurNom, setVendeurNom] = useState("Vendeur inconnu");
  const [utilisateurNoms, setUtilisateurNoms] = useState({});
  const [commentaires, setCommentaires] = useState(produit.commentaires);
  const [mainImage, setMainImage] = useState(produit.images[0]);

  //  Utilisation du contexte de panier
  const { addToCart } = useCart() || { addToCart: () => {} };

  //  Pour rediriger l'utilisateur
  const navigate = useNavigate();

  //  Vérifie l'identité de l'utilisateur actuel
  const userId = localStorage.getItem("userid");
  const isVendeur = userId === produit.vendeur_id;
  const isAdmin = userId === "67d58664c14a211ded9e25ed";

  //  Récupère le nom d'un utilisateur par son ID (utile pour les commentaires)
  const fetchNomUtilisateur = async (id) => {
    if (!utilisateurNoms[id]) {
      try {
        const data = await getVendeur(id);
        if (data?.success) {
          setUtilisateurNoms(prev => ({
            ...prev,
            [id]: data.vendeur.nom
          }));
        } else {
          setUtilisateurNoms(prev => ({
            ...prev,
            [id]: "Utilisateur inconnu"
          }));
        }
      } catch {
        setUtilisateurNoms(prev => ({
          ...prev,
          [id]: "Utilisateur inconnu"
        }));
      }
    }
  };

  
  //  Appelé au montage pour afficher les noms des auteurs des commentaires
  useEffect(() => {
    const fetchAllUsers = async () => {
      const ids = [...new Set(produit.commentaires.map(c => c.utilisateur_id))];
      ids.forEach(fetchNomUtilisateur);
    };
    fetchAllUsers();
  }, [produit]);

  //  Récupère le nom du vendeur du produit
  useEffect(() => {
    const fetchVendeur = async () => {
      if (produit.vendeur_id) {
        const data = await getVendeur(produit.vendeur_id);
        if (data.success) {
          setVendeurNom(data.vendeur.nom);
        }
      }
    };
    fetchVendeur();
  }, [produit]);

  //  Fonction pour soumettre un commentaire
  const handleCommentSubmit = async () => {
    if (!commentaire.trim()) return alert("Le commentaire ne peut pas être vide");
    const utilisateurNom = localStorage.getItem("username");

    const result = await ajouterCommentaire(produit._id, commentaire, note);

    if (result.success) {
      const newComment = {
        utilisateur_id: userId,
        utilisateur_nom: utilisateurNom || "Nom inconnu",
        commentaire,
        note,
      };
      setCommentaires(prev => [newComment, ...prev]);
      setCommentaire("");
      setNote(5);
      alert("Commentaire ajouté !");
    } else {
      alert(result.message);
    }
  };

  //  Supprimer un produit
  const handleDeleteProduit = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      const result = await deleteProduit(produit._id);
      if (result.success) {
        alert("Produit supprimé avec succès !");
        navigate(-1);
      } else {
        alert(`Erreur : ${result.message}`);
      }
    }
  };

  //  Valider un produit (pour l'admin)
  const handleValiderProduit = async () => {
    const result = await validerProduit(produit._id);
    if (result.success) {
      alert("Produit validé avec succès !");
      navigate("/ValidationDesProduits");
    } else {
      alert(`Erreur : ${result.message}`);
    }
  };


  return (
    <div>
      {!isAdmin && <Navbar />}

      <div className="details-container">
        {/*  Section supérieure : image + infos principales */}
        <div className="top-section">
          <div className="image-section">
            <div className="main-image-container">
              <img src={`http://localhost:5005/${mainImage}`} alt={produit.nom} className="main-image" />
            </div>
            <div className="thumbnails">
              {produit.images.filter(img => img !== mainImage).map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5005/${img}`}
                  alt={`${produit.nom} ${i}`}
                  className={`thumbnail ${mainImage === img ? 'active-thumbnail' : ''}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/*  Informations du produit */}
          <div className="info-section">
            <h1>{produit.nom}</h1>
            <p className="prix">{produit.prix} DA</p>
            <p className="vendeur"><span className="badge">Vendu par:</span> {vendeurNom}</p>
            <p className="description">{produit.description}</p>

            {/*  Détails techniques */}
            <div className="info-details">
              <div className="left-info">
                <p><strong>Catégorie:</strong> {produit.categorie}</p>
                <p><strong>Couleur:</strong> {produit.couleur}</p>
                <p><strong>Matériau:</strong> {produit.materiau}</p>
                <p><strong>État:</strong> {produit.etat}</p>
                <p><strong>Disponibilité:</strong> {produit.quantite_disponible}</p>
              </div>
              {produit.dimensions && (
                <div className="right-info">
                  {produit.dimensions.largeur && <p><strong>Largeur:</strong> {produit.dimensions.largeur}cm</p>}
                  {produit.dimensions.hauteur && <p><strong>Hauteur:</strong> {produit.dimensions.hauteur}cm</p>}
                  {produit.dimensions.profondeur && <p><strong>Profondeur:</strong> {produit.dimensions.profondeur}cm</p>}
                </div>
              )}
            </div>

            {/*  Boutons selon le rôle (vendeur, admin, client) */}
            <div className="buttons">
              {isVendeur ? (
                <>
                  <button className="ajouter-panier" onClick={() => navigate(`/modifier/${produit._id}`, { state: { produit } })}>Modifier 📝</button>
                  <button className="acheter-direct" onClick={handleDeleteProduit}>Supprimer 🗑️</button>
                </>
              ) : isAdmin ? (
                <>
                  <button className="ajouter-panier" onClick={handleValiderProduit}>Valider ✅</button>
                  <button className="acheter-direct" onClick={handleDeleteProduit}>Supprimer 🗑️</button>
                </>
              ) : (
                <>
                  <button className="ajouter-panier" onClick={() => {
                    addToCart(produit);
                    alert(`${produit.nom} a été ajouté au panier`);
                  }}>Ajouter au panier 🛒</button>
                  <button className="acheter-direct">Acheter maintenant 💳</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/*  Section des commentaires */}
        <div className="commentaires-section">
  {produit.valider ? (
    <>
      <h2>Commentaires</h2>
      {commentaires.length > 0 ? (
        commentaires.map((comment, i) => (
          <div key={i} className="commentaire">
            <p className="comment-user">
              <strong>{comment.utilisateur_nom || "Utilisateur inconnu"}</strong>
            </p>
            <div className="stars">
              {Array.from({ length: comment.note }, (_, i) => <span key={i}>⭐</span>)}
            </div>
            <p className="comment-text">{comment.commentaire}</p>
          </div>
        ))
      ) : (
        <p className="no-comments">Aucun commentaire pour ce produit.</p>
      )}

      {/* Champ de commentaire si l'utilisateur est connecté */}
      {isUserConnected() ? (
        <>
          <textarea 
            value={commentaire} 
            onChange={(e) => setCommentaire(e.target.value)} 
            placeholder="Écrire un commentaire..." 
            className="comment-input"
          />
          <div className="rating-section">
            <p>Note :</p>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`star ${note === n ? "selected" : ""}`}
                onClick={() => setNote(n)}
              >
                ⭐
              </span>
            ))}
          </div>
          <button className="envoyer-commentaire" onClick={handleCommentSubmit}>
            Envoyer
          </button>
        </>
      ) : (
        <button className="envoyer-commentaire" onClick={() => navigate("/login")}>
          Connectez-vous pour commenter
        </button>
      )}
    </>
  ) : (
    <p className="no-comments"></p>
  )}
</div>
      </div>
    </div>
  );
};

export default DetailsProduit;
