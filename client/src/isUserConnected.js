

export const isUserConnected = () => {
    const token = localStorage.getItem("token"); // Récupère le token
    return !!token; // Retourne true si un token existe, sinon false
  };
  
  export const logout = () => {
    localStorage.removeItem("token"); // Supprime le token
    localStorage.removeItem("userid");
    
   
  };