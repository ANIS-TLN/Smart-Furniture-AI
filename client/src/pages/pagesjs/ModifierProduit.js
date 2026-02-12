import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateProduit } from "../../api";
import { FaTimes } from "react-icons/fa";
import "../pagescss/ModifierProduit.css";
import Navbar from '../../components/componentjs/navbar';

export default function ModifierProduit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const produitExistant = location.state?.produit;

  // State for managing images (previews shown in UI)
  const [imagesPreviews, setImagesPreviews] = useState([]);
  
  // State for tracking existing image paths from server
  const [existingImages, setExistingImages] = useState([]);
  
  // State for tracking new image files to upload
  const [fichiersImages, setFichiersImages] = useState([]);
  
  // State for form data
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    nom: "",
    materiau: "",
    couleur: "",
    prix: "",
    prixReduction: "",
    stock: "",
    categorie: "",
    etat: "",
    description: "",
    dimensions: { largeur: "", hauteur: "", profondeur: "" },
  });
  
  // State to track errors
  const [errors, setErrors] = useState({});
  const userId = localStorage.getItem("userid");
  const isAdmin = userId === "67d58664c14a211ded9e25ed";

  useEffect(() => {
    if (produitExistant) {
      setDonneesFormulaire({
        nom: produitExistant.nom || "",
        materiau: produitExistant.materiau || "",
        couleur: produitExistant.couleur || "",
        prix: produitExistant.prix || "",
        prixReduction: produitExistant.prixReduction || "",
        stock: produitExistant.quantite_disponible || "",
        categorie: produitExistant.categorie || "",
        etat: produitExistant.etat || "",
        description: produitExistant.description || "",
        dimensions: produitExistant.dimensions || {
          largeur: "",
          hauteur: "",
          profondeur: "",
        },
      });

      if (produitExistant.images && produitExistant.images.length > 0) {
        // Store original image paths from server
        setExistingImages(produitExistant.images);
        
        // Create preview URLs for existing images
        const imagePreviewUrls = produitExistant.images.map(
          (img) => `http://localhost:5005/${img}`
        );
        setImagesPreviews(imagePreviewUrls);
      }
    }
  }, [produitExistant]);

  const categories = [
    "Salon",
    "Cuisine",
    "Salle de bains",
    "Rangement",
    "Exterieur",
    "Chambre",
    "Bureau",
  ];

  const etats = ["Neuf", "Occasion"];

  const gererTelechargementImages = (event) => {
    const fichiers = Array.from(event.target.files);
    
    // Create object URLs for new images
    const nouvellesPreviews = fichiers.map((fichier) =>
      URL.createObjectURL(fichier)
    );
    
    // Add new previews to existing previews
    setImagesPreviews((prevPreviews) => [...prevPreviews, ...nouvellesPreviews]);
    
    // Add new files to existing files collection
    setFichiersImages((prevFiles) => [...prevFiles, ...fichiers]);
  };

  const supprimerImage = (index) => {
    // Create new arrays without the deleted image
    const newImagesPreviews = [...imagesPreviews];
    newImagesPreviews.splice(index, 1);
    setImagesPreviews(newImagesPreviews);
    
    // If this is an existing image from server
    if (index < existingImages.length) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
    } 
    // If this is a newly added image
    else {
      const newFileIndex = index - existingImages.length;
      const newFichiersImages = [...fichiersImages];
      newFichiersImages.splice(newFileIndex, 1);
      setFichiersImages(newFichiersImages);
    }
  };

  const gererChangement = (e) => {
    const { name, value } = e.target;
    setDonneesFormulaire((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const gererSoumissionFormulaire = async (e) => {
    e.preventDefault();
    if (!validerFormulaire()) {
      alert("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    const formData = new FormData();
    formData.append("nom", donneesFormulaire.nom);
    formData.append("materiau", donneesFormulaire.materiau);
    formData.append("couleur", donneesFormulaire.couleur);
    formData.append("prix", donneesFormulaire.prix);
    formData.append("prixReduction", donneesFormulaire.prixReduction);
    formData.append("quantite_disponible", donneesFormulaire.stock);
    formData.append("categorie", donneesFormulaire.categorie);
    formData.append("etat", donneesFormulaire.etat);
    formData.append("description", donneesFormulaire.description);
    formData.append("dimensions", JSON.stringify(donneesFormulaire.dimensions));
    
    // Add existing images that weren't deleted
    formData.append("existingImages", JSON.stringify(existingImages));
    
    // Add any new image files
    fichiersImages.forEach((fichier) => {
      formData.append("images", fichier);
    });

    try {
      await updateProduit(id, formData);
      alert("Produit modifié avec succès !");
      navigate(-1); 
    } catch (error) {
      console.error("Erreur lors de la modification du produit :", error);
      alert("Une erreur est survenue lors de la modification.");
    }
  };

  const validerFormulaire = () => {
    const newErrors = {};

    if (imagesPreviews.length === 0) {
      newErrors.images = "Veuillez ajouter au moins une image.";
    }

    if (!donneesFormulaire.categorie) {
      newErrors.categorie = "Veuillez sélectionner une catégorie.";
    }
    if (!donneesFormulaire.nom) {
      newErrors.nom = "Veuillez entrer le nom du produit.";
    }
    if (!donneesFormulaire.materiau) {
      newErrors.materiau = "Veuillez entrer le matériau.";
    }
    if (!donneesFormulaire.couleur) {
      newErrors.couleur = "Veuillez entrer la couleur du produit.";
    }
    if (
      !donneesFormulaire.dimensions.largeur ||
      !donneesFormulaire.dimensions.hauteur ||
      !donneesFormulaire.dimensions.profondeur
    ) {
      newErrors.dimensions = "Veuillez entrer toutes les dimensions.";
    }

    if (!donneesFormulaire.etat) {
      newErrors.etat = "Veuillez sélectionner un état.";
    }
    if (!donneesFormulaire.prix) {
      newErrors.prix = "Veuillez entrer le prix.";
    }
    if (!donneesFormulaire.stock) {
      newErrors.stock = "Veuillez entrer la quantité en stock.";
    }
    if (!donneesFormulaire.description) {
      newErrors.description = "Veuillez entrer une description.";
    }

    if (donneesFormulaire.prix < 0) {
      newErrors.prix = "Le prix ne peut pas être négatif.";
    }
    if (donneesFormulaire.stock < 0) {
      newErrors.stock = "La quantité ne peut pas être négative.";
    }

    if (donneesFormulaire.prixReduction < 0) {
      newErrors.prixReduction =
        "Le prix avant la remise ne peut pas être négatif.";
    }

    if (donneesFormulaire.prixReduction && 
        parseFloat(donneesFormulaire.prixReduction) <= parseFloat(donneesFormulaire.prix)) {
      newErrors.prixReduction =
        "Le prix avant la remise doit être supérieur au prix actuel.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div>
     {!isAdmin && <Navbar />}
    <form onSubmit={gererSoumissionFormulaire} className="form-container">
      <h2 className="form-title">
        {produitExistant
          ? "Modifier les informations du produit"
          : "Ajouter un nouveau produit"}
      </h2>
      <label className="form-label">Images du produit</label>
      <div className="image-preview-container">
        {imagesPreviews.map((src, index) => (
          <div key={index} className="image-wrapper">
            <img src={src} alt="Aperçu" className="image-preview" />
            <button 
              type="button" 
              className="image-delete-btn" 
              onClick={() => supprimerImage(index)}
              title="Supprimer l'image"
            >
              <FaTimes />
            </button>
          </div>
        ))}
        {imagesPreviews.length < 4 && (
          <label className="add-image-button">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={gererTelechargementImages}
              className="hidden-file-input"
            />
            <span>+</span>
          </label>
        )}
      </div>
      {errors.images && <p className="error-message">{errors.images}</p>}

      <input
        type="text"
        name="nom"
        placeholder="Nom de l'article"
        value={donneesFormulaire.nom}
        onChange={gererChangement}
        className="input-field"
      />
      {errors.nom && <p className="error-message">{errors.nom}</p>}

      <input
        type="text"
        name="materiau"
        placeholder="Matériau"
        value={donneesFormulaire.materiau}
        onChange={gererChangement}
        className="input-field"
      />
      {errors.materiau && <p className="error-message">{errors.materiau}</p>}

      <input
        type="text"
        name="couleur"
        placeholder="Couleur"
        value={donneesFormulaire.couleur}
        onChange={gererChangement}
        className="input-field"
      />
      {errors.couleur && <p className="error-message">{errors.couleur}</p>}

      <select
        name="categorie"
        value={donneesFormulaire.categorie}
        onChange={gererChangement}
        className="input-field"
      >
        <option value="" disabled>
          Choisissez une catégorie
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {errors.categorie && <p className="error-message">{errors.categorie}</p>}

      <select
        name="etat"
        value={donneesFormulaire.etat}
        onChange={gererChangement}
        className="input-field"
      >
        <option value="" disabled>
          Choisissez un état
        </option>
        {etats.map((etat) => (
          <option key={etat} value={etat}>
            {etat}
          </option>
        ))}
      </select>
      {errors.etat && <p className="error-message">{errors.etat}</p>}

      <fieldset className="dimensions-fieldset">
        <legend>Dimensions (cm)</legend>
        <input
          type="number"
          name="largeur"
          placeholder="Largeur"
          value={donneesFormulaire.dimensions.largeur}
          onChange={(e) =>
            setDonneesFormulaire((prev) => ({
              ...prev,
              dimensions: { ...prev.dimensions, largeur: e.target.value },
            }))
          }
          className="input-field small-input"
        />
        <input
          type="number"
          name="hauteur"
          placeholder="Hauteur"
          value={donneesFormulaire.dimensions.hauteur}
          onChange={(e) =>
            setDonneesFormulaire((prev) => ({
              ...prev,
              dimensions: { ...prev.dimensions, hauteur: e.target.value },
            }))
          }
          className="input-field small-input"
        />
        <input
          type="number"
          name="profondeur"
          placeholder="Profondeur"
          value={donneesFormulaire.dimensions.profondeur}
          onChange={(e) =>
            setDonneesFormulaire((prev) => ({
              ...prev,
              dimensions: { ...prev.dimensions, profondeur: e.target.value },
            }))
          }
          className="input-field small-input"
        />
      </fieldset>
      {errors.dimensions && (
        <p className="error-message">{errors.dimensions}</p>
      )}

      <div className="inline-fields">
        <input
          type="number"
          name="prixReduction"
          placeholder="Prix avant la remise"
          value={donneesFormulaire.prixReduction}
          onChange={gererChangement}
          className="input-field"
        />
        <input
          type="number"
          name="prix"
          placeholder="Prix"
          value={donneesFormulaire.prix}
          onChange={gererChangement}
          className="input-field"
        />
      </div>
      {errors.prix && <p className="error-message">{errors.prix}</p>}
      {errors.prixReduction && <p className="error-message">{errors.prixReduction}</p>}

      <input
        type="number"
        name="stock"
        placeholder="Quantité en stock"
        value={donneesFormulaire.stock}
        onChange={gererChangement}
        className="input-field"
      />
      {errors.stock && <p className="error-message">{errors.stock}</p>}

      <textarea
        name="description"
        placeholder="Description du produit"
        value={donneesFormulaire.description}
        onChange={gererChangement}
        className="input-field"
      />
      {errors.description && (
        <p className="error-message">{errors.description}</p>
      )}

      <button type="submit" className="submit-button">
        {produitExistant ? "Enregistrer la modification" : "Ajouter"}
      </button>
    </form>
    </div>
  );
}