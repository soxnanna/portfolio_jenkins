# ============================================================
# frontend/Dockerfile — Multi-stage build
#
# ÉTAPE 1 (builder) : Node.js compile React → dossier build/
# ÉTAPE 2 (serveur) : Nginx sert les fichiers statiques
#
# Résultat : image finale ~25 Mo (sans Node.js ni node_modules)
# ============================================================

# ── ÉTAPE 1 : BUILDER ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les dépendances en premier (cache Docker)
COPY package*.json ./

# Installer toutes les dépendances (y compris devDependencies pour le build)
RUN npm install --legacy-peer-deps && npm install react-scripts

# Copier le code source
COPY . .

# Compiler React en fichiers statiques → dossier build/
# Create React App (react-scripts) génère build/ (Vite génère dist/)
RUN npm run build

# ── ÉTAPE 2 : SERVEUR FINAL ─────────────────────────────────
# Nginx Alpine : serveur web ultra-léger
# Node.js n'est PAS dans cette image finale
FROM nginx:alpine

# Copier uniquement le résultat du build depuis l'étape précédente
COPY --from=builder /app/build /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
