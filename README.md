# 🛋️ SmartFurniture - AI Powered Marketplace

> 🎓 **Projet de Fin d'Année (Master 1)**
> Une plateforme E-commerce Fullstack (MERN) intégrant l'IA générative pour une expérience d'achat assistée.

![Aperçu du Projet](capture.png)


## 💡 Le Concept
SmartFurniture n'est pas un simple site de vente. C'est une application intelligente qui aide les utilisateurs à décorer leur intérieur grâce à **Google Gemini AI**.
L'utilisateur peut dialoguer avec l'assistant pour trouver le meuble parfait selon ses goûts et son budget.

## 🔥 Fonctionnalités Principales

### 🤖 Intelligence Artificielle (Gemini)
* **Assistant Déco :** Chatbot intégré capable de recommander des produits spécifiques.
* **Analyse :** Utilisation de l'API Google Gemini pour traiter les demandes en langage naturel.

### 🔐 Sécurité Avancée
* **Authentification JWT :** Système de login sécurisé sans état (Stateless).
* **Hashage :** Protection des mots de passe avec BCrypt.
* **Contrôle d'accès (RBAC) :** 3 niveaux de droits (Admin, Vendeur, Acheteur).

### 🛒 E-Commerce Complet
* **Marketplace Hybride :** Tout utilisateur peut acheter ET vendre ses propres meubles.
* **Dashboard Admin :** Gestion complète des utilisateurs et des produits (CRUD).
* **Panier & Commandes :** Gestion d'état complexe avec React Context.

## 🛠️ Stack Technique

| Domaine | Technologies |
| :--- | :--- |
| **Frontend** | React.js, CSS Modules, Hooks, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (NoSQL), Mongoose |
| **IA** | Google Gemini API |
| **Outils** | Git, Postman, NPM |

## 🚀 Installation & Test

Ce projet est conçu pour tourner en local.

1. **Cloner le projet :**
   ```bash
   git clone [https://github.com/TON-PSEUDO/TON-PROJET.git](https://github.com/TON-PSEUDO/TON-PROJET.git)
Backend (Serveur) :
Il faut configurer un fichier .env avec votre clé GEMINI_API_KEY.

Bash

cd server
npm install
npm start
Frontend (Client) :

Bash

cd client
npm install
npm start
Réalisé par ANIS 
