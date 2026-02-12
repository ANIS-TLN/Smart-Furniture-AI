import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api"; 
import "../pagescss/auth.css";


const Inscription = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  //  Schéma de validation 
  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Nom requis"),
    lastname: Yup.string().required("Prénom requis"), // ➕ Ajout validation lastname
    address: Yup.string().required("Adresse requise"), // ➕ Ajout validation address
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string().required("Mot de passe requis").min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  });

  // Configuration du formulaire avec react-hook-form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  //  Soumission du formulaire //Ajouté pour gérer les erreurs du backend (ex: email déjà utilisé)
  const [serverError, setServerError] = useState("");

// ...

const onSubmit = async (data) => {
  try {
    const response = await registerUser(data);

    if (response && response.user) {
      navigate("/login");
    } else if (response && response.message) {
      //  Affiche le message d'erreur envoyé par le serveur
      setServerError(response.message);
    } else {
      setServerError("Une erreur inconnue est survenue.");
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription : ", error);
    setServerError("Erreur réseau ou serveur.");
  }
};


  return (
    
      <div
        className="auth-container"
        style={{
          minHeight: "100vh",
          background: `url('/images/decoration.jpg') no-repeat center center`,
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="auth-card">
          <h2 className="auth-title">Inscription</h2>
          <p className="auth-subtitle">Créez un nouveau compte</p>
         
        

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Champ Nom */}
            <div>
              <label htmlFor="nom">Nom</label>
              <Controller
                name="nom"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="nom"
                    className="auth-input"
                    type="text"
                    placeholder="Votre nom"
                  />
                )}
              />
              {errors.nom && <span className="auth-error">{errors.nom.message}</span>}
            </div>

            {/* Champ Prénom (lastname)  */}
            <div>
              <label htmlFor="lastname">Prénom</label>
              <Controller
                name="lastname"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="lastname"
                    className="auth-input"
                    type="text"
                    placeholder="Votre prénom"
                  />
                )}
              />
              {errors.lastname && <span className="auth-error">{errors.lastname.message}</span>}
            </div>

            {/* Champ Adresse  */}
            <div>
              <label htmlFor="address">Adresse</label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="address"
                    className="auth-input"
                    type="text"
                    placeholder="Votre adresse"
                  />
                )}
              />
              {errors.address && <span className="auth-error">{errors.address.message}</span>}
            </div>

            {/* Champ Email */}
            <div>
              <label htmlFor="email">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    className="auth-input"
                    type="email"
                    placeholder="Votre email"
                  />
                )}
              />
              {errors.email && <span className="auth-error">{errors.email.message}</span>}
            </div>

            {/* Champ Mot de passe */}
            <div className="auth-password">
              <label htmlFor="password">Mot de passe</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="password-container">
                    <input
                      {...field}
                      id="password"
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                    />
                    <span
                      className="auth-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                )}
              />
              {errors.password && <span className="auth-error">{errors.password.message}</span>}
            </div>
              {/*  Ajout du message d’erreur global pour afficher les erreurs serveur */}
              {serverError && <div className="auth-error-global">{serverError}</div>}
            <button type="submit" className="auth-button">
              S'inscrire
            </button>
          </form>

          <div className="auth-footer">
            Déjà inscrit ?{" "}
            <a href="/login" className="auth-link">
              Se connecter
            </a>
          </div>
        </div>
      </div>
   
  );
};

export default Inscription;
