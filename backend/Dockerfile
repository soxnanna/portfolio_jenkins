# ============================================================
# backend/Dockerfile
# Image : Node.js 20 Alpine (légère ~50 Mo)
# ============================================================

FROM node:20-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# ── ÉTAPE 1 : dépendances ────────────────────────────────────
# Copier package.json EN PREMIER pour profiter du cache Docker :
# si le code source change mais pas package.json,
# Docker réutilise le cache npm install (rebuild en quelques secondes)
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --omit=dev

# ── ÉTAPE 2 : code source ────────────────────────────────────
# Copier tout le reste du code après npm install
COPY . .

# Informer Docker que ce conteneur écoute sur le port 3001
EXPOSE 3001

# Commande de démarrage
CMD ["node", "app.js"]
