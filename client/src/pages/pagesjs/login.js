import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import "../pagescss/auth.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(""); // Pour afficher les erreurs
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string().required("Mot de passe requis"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoginError(""); // Réinitialiser le message d'erreur
      const response = await loginUser(data);

      if (response && response.token) {
        const isAdmin = response.user._id === "67d58664c14a211ded9e25ed";

        if (isAdmin) {
          navigate("/Dashboard");
        } else {
          navigate("/");
        }
      } else {
        setLoginError("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      setLoginError("Une erreur est survenue lors de la connexion.");
      console.error("Erreur lors de la connexion : ", error);
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
        <h2 className="auth-title">Connexion</h2>
        <p className="auth-subtitle">Connectez-vous à votre compte</p>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            {errors.email && (
              <span className="auth-error">{errors.email.message}</span>
            )}
          </div>

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
            {errors.password && (
              <span className="auth-error">{errors.password.message}</span>
            )}
          </div>

          {/* Affichage de l'erreur globale */}
          {loginError && (
            <div className="auth-error-message">{loginError}</div>
          )}

          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>

        <div className="auth-footer">
          Pas encore inscrit ?{" "}
          <a href="/inscription" className="auth-link">
            S'inscrire
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
