const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization//// Récupère le token du header

    if (!token) {
        return res.status(401).json({ message: "Accès refusé, token manquant" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], "secret_key"); 
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Token invalide" });
    }
};

module.exports = { verifyToken };