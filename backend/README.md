# API REST Portfolio — Express.js + MongoDB

API REST complète de gestion de portfolio, construite avec **Express.js** et **MongoDB** (via Mongoose).

---

## 🏗️ Architecture du projet

```
portfolio-api/
├── app.js                    ← Point d'entrée — démarrage du serveur
├── .env                      ← Variables d'environnement (port, MongoDB URI)
├── .env.example              ← Modèle .env à copier
├── package.json
│
├── config/
│   └── connectdb.js          ← Module connexion MongoDB
│
├── models/
│   └── projetModel.js        ← Schéma Mongoose (modèle de données)
│
├── controllers/
│   └── projetController.js   ← Logique métier (CRUD complet)
│
└── routes/
    └── projetRoutes.js       ← Définition des routes REST
```

---

## 🚀 Installation et démarrage

### 1. Prérequis
- **Node.js** v18+ installé
- **MongoDB** installé en local **OU** un compte [MongoDB Atlas](https://cloud.mongodb.com)

### 2. Installer les dépendances
```bash
cd portfolio-api
npm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Puis éditer `.env` :
```env
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/portfolioDB
NODE_ENV=development
```

### 4. Démarrer MongoDB (si en local)
```bash
# Linux / macOS
mongod

# Windows (service)
net start MongoDB
```

### 5. Lancer le serveur
```bash
# Production
npm start

# Développement (rechargement automatique)
npm run dev
```

---

## 📡 Endpoints de l'API

| Méthode   | URL              | Description               | Body attendu              |
|-----------|------------------|---------------------------|---------------------------|
| `GET`     | `/projets`       | Lister tous les projets   | —                         |
| `GET`     | `/projets?search=mot` | Recherche par mot-clé | —                    |
| `POST`    | `/projets`       | Ajouter un projet         | JSON (voir ci-dessous)    |
| `GET`     | `/projets/:id`   | Obtenir un projet par ID  | —                         |
| `PUT`     | `/projets/:id`   | Modifier un projet        | JSON (champs à modifier)  |
| `DELETE`  | `/projets/:id`   | Supprimer un projet       | —                         |

---

## 📝 Format des données

### Body POST / PUT
```json
{
  "libelle"     : "Mon projet e-commerce",
  "sourceImage" : "https://exemple.com/image.jpg",
  "description" : "Description détaillée du projet...",
  "technologie" : "React, Node.js, MongoDB",
  "dateCreation": "2026-05-02"
}
```

### Réponse succès
```json
{
  "success": true,
  "message": "Projet ajouté avec succès.",
  "data": {
    "id"          : "6650abc123...",
    "libelle"     : "Mon projet e-commerce",
    "sourceImage" : "...",
    "description" : "...",
    "technologie" : "React, Node.js, MongoDB",
    "dateCreation": "2026-05-02",
    "createdAt"   : "2026-05-02T10:30:00.000Z",
    "updatedAt"   : "2026-05-02T10:30:00.000Z"
  }
}
```

### Réponse erreur
```json
{
  "success": false,
  "message": "Le libellé du projet est obligatoire."
}
```

---

## 🔗 Connexion avec le Frontend React

Le fichier `src/api.js` du frontend React est configuré pour appeler ce backend :
```js
const API_URL = 'http://localhost:3001/projets';
```

**Pour lancer le stack complet :**

```bash
# Terminal 1 — Backend API
cd portfolio-api && npm run dev

# Terminal 2 — Frontend React
cd portfolio-reactJS && npm start
```
