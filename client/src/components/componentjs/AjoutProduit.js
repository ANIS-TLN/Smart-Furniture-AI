import { useState } from "react";
import { addProduit } from "../../api"; // Importation de la fonction d'ajout de produit
import "../componentcss/AjoutProduit.css";
import Navbar from "./navbar";
import Loader from "./Loader";

export default function AjoutProduit() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [fichiersImages, setFichiersImages] = useState([]);
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

  const categories = [
    "Salon",
    "Cuisine",
    "Salle de bains",
    "Rangement",
    "Exterieur",
    "Chambre",
    "Bureau",
    "Decoration"
  ];

  const etats = ["Neuf", "Occasion"];

  // Functions

  const gererTelechargementImages = (event) => {
    const fichiers = Array.from(event.target.files);
    const nouvellesImages = fichiers.map((fichier) =>
      URL.createObjectURL(fichier)
    );

    setImages((prevImages) => [...prevImages, ...nouvellesImages]);
    setFichiersImages((prevFiles) => [...prevFiles, ...fichiers]);
  };

  const gererChangement = (e) => {
    const { name, value } = e.target;
    setDonneesFormulaire((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const gererSoumissionFormulaire = async (e) => {
    e.preventDefault();

    const isStep1Valid = step === 1 ? validateStep() : true;
    const isStep2Valid = step === 2 ? validateStep() : true;
    const isStep3Valid = step === 3 ? validateStep() : true;

    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
      return;
    }
    //a modifier
    //const vendeurId = localStorage.getItem("userid");
    const formData = new FormData();
    //formData.append("vendeur_id", vendeurId);
    formData.append("nom", donneesFormulaire.nom);
    formData.append("materiau", donneesFormulaire.materiau);
    formData.append("couleur", donneesFormulaire.couleur);
    formData.append("prix", donneesFormulaire.prix);
    formData.append("prixReduction", donneesFormulaire.prixReduction);
    formData.append("quantite_disponible", donneesFormulaire.stock);
    formData.append("description", donneesFormulaire.description);
    formData.append("categorie", donneesFormulaire.categorie);
    formData.append("etat", donneesFormulaire.etat);
    formData.append("dimensions", JSON.stringify(donneesFormulaire.dimensions));

    fichiersImages.forEach((fichier) => {
      formData.append("images", fichier);
    });

    try {
      const response = await addProduit(formData);

      console.log("✅ Réponse du serveur :", response);

      alert("Produit ajouté avec succès !");
      setDonneesFormulaire({
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
      setImages([]);
      setFichiersImages([]);
      setStep(1);
    } catch (error) {
      console.error("Erreur soumission:", error);
      alert(`Erreur AjP: ${error.response?.data?.message || error.message}`);
    }
  };

  const validateStep = () => {
    const newErrors = {};
  
    // Validation de la première étape (images)
    if (step === 1) {
      if (images.length === 0) {
        newErrors.images = "Veuillez ajouter au moins une image.";
      }
    }
  
    // Validation de la deuxième étape (nom, catégorie, matériaux, etc.)
    if (step === 2) {
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
  
      // Vérification des dimensions (elles doivent être des nombres positifs)
      const { largeur, hauteur, profondeur } = donneesFormulaire.dimensions;
      if (!largeur || isNaN(largeur) || largeur <= 0) {
        newErrors.dimensions = "La largeur doit être un nombre positif.";
      } else if (!hauteur || isNaN(hauteur) || hauteur <= 0) {
        newErrors.dimensions = "La hauteur doit être un nombre positif.";
      } else if (!profondeur || isNaN(profondeur) || profondeur <= 0) {
        newErrors.dimensions = "La profondeur doit être un nombre positif.";
      }
    }
  
    // Validation de la troisième étape (prix, état, stock, description)
    if (step === 3) {
      if (!donneesFormulaire.etat) {
        newErrors.etat = "Veuillez sélectionner un état.";
      }
      if (!donneesFormulaire.prix || isNaN(donneesFormulaire.prix) || donneesFormulaire.prix <= 0) {
        newErrors.prix = "Le prix doit être un nombre positif.";
      }
      if (!donneesFormulaire.stock || isNaN(donneesFormulaire.stock) || donneesFormulaire.stock < 0) {
        newErrors.stock = "La quantité en stock doit être un nombre valide (positif ou zéro).";
      }
      if (!donneesFormulaire.description) {
        newErrors.description = "Veuillez entrer une description.";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si aucune erreur
  };
  

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      <Navbar />
      <Loader>
        <div className="produit-form-background">
          <form onSubmit={gererSoumissionFormulaire} className="form-container">
            <h2 className="form-title">Ajouter un nouveau produit</h2>

            {step === 1 && (
              <>
                <label className="form-label">Ajouter des images</label>
                <div className="image-preview-container">
                  {images.map((src, index) => (
                    <div key={index} className="image-wrapper">
                      <img src={src} alt="Aperçu" className="image-preview" />
                    </div>
                  ))}
                  {images.length < 4 && (
                    <label className="add-image-button">
                      <input
                        type="file"
                        multiple
                        onChange={gererTelechargementImages}
                        className="hidden-file-input"
                      />
                      <span>+</span>
                    </label>
                  )}
                </div>
                {errors.images && (
                  <p className="error-message">{errors.images}</p>
                )}
                <div className="step-navigation">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="next-button"
                  >
                    Suivant
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
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
                {errors.categorie && (
                  <p className="error-message">{errors.categorie}</p>
                )}

                <input
                  type="text"
                  name="nom"
                  placeholder="Nom du produit"
                  value={donneesFormulaire.nom}
                  onChange={gererChangement}
                  className="input-field"
                />
                {errors.nom && <p className="error-message">{errors.nom}</p>}

                <input
                  type="text"
                  name="materiau"
                  placeholder="matériau"
                  value={donneesFormulaire.materiau}
                  onChange={gererChangement}
                  className="input-field"
                />
                {errors.materiau && (
                  <p className="error-message">{errors.materiau}</p>
                )}

                <input
                  type="text"
                  name="couleur"
                  placeholder="Couleur du produit"
                  value={donneesFormulaire.couleur}
                  onChange={gererChangement}
                  className="input-field"
                />
                {errors.couleur && (
                  <p className="error-message">{errors.couleur}</p>
                )}

                <fieldset className="dimensions-fieldset">
                  <legend className="form-label">Dimensions (cm)</legend>
                  <input
                    type="number"
                    name="largeur"
                    placeholder="Largeur"
                    value={donneesFormulaire.dimensions.largeur}
                    onChange={(e) =>
                      setDonneesFormulaire((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          largeur: e.target.value,
                        },
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
                        dimensions: {
                          ...prev.dimensions,
                          hauteur: e.target.value,
                        },
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
                        dimensions: {
                          ...prev.dimensions,
                          profondeur: e.target.value,
                        },
                      }))
                    }
                    className="input-field small-input"
                  />
                </fieldset>
                {errors.dimensions && (
                  <p className="error-message">{errors.dimensions}</p>
                )}

                <div className="step-navigation">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="prev-button"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="next-button"
                  >
                    Suivant
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <select
                  name="etat"
                  value={donneesFormulaire.etat}
                  onChange={gererChangement}
                  className="input-field"
                >
                  <option value="" disabled selected>
                    Choisissez un état
                  </option>
                  {etats.map((etat) => (
                    <option key={etat} value={etat}>
                      {etat}
                    </option>
                  ))}
                </select>
                {errors.etat && <p className="error-message">{errors.etat}</p>}

                <div className="inline-fields">
                  <input
                    type="number"
                    name="prixReduction"
                    placeholder="Prix avant la Remise en dinar algérien (optionnel) "
                    value={donneesFormulaire.prixReduction}
                    onChange={gererChangement}
                    className="input-field"
                  />
                  {errors.prix && (
                    <p className="error-message">{errors.prix}</p>
                  )}
                  <input
                    type="number"
                    name="prix"
                    placeholder="Prix en dinar algérien"
                    value={donneesFormulaire.prix}
                    onChange={gererChangement}
                    className="input-field"
                  />
                </div>

                <input
                  type="number"
                  name="stock"
                  placeholder="Quantité en stock"
                  value={donneesFormulaire.stock}
                  onChange={gererChangement}
                  className="input-field"
                />
                {errors.stock && (
                  <p className="error-message">{errors.stock}</p>
                )}

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

                <div className="step-navigation">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="prev-button"
                  >
                    Précédent
                  </button>
                  <button type="submit" className="submit-butt">
                    Publier
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </Loader>
    </>
  );
}
