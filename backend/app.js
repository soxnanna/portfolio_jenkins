/* =============================================
   app.js — Point d'entrée de l'API Portfolio
   Express.js + MongoDB (Mongoose)
   ============================================= */

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const connectDB    = require('./config/connectdb');
const projetRoutes = require('./routes/projetRoutes');

/* ── Connexion à MongoDB ── */
connectDB();

/* ── Initialisation d'Express ── */
const app = express();

/* ════════════════════════════════════════════
   MIDDLEWARES GLOBAUX
   ════════════════════════════════════════════ */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* CORS — origines autorisées (dev local + Docker) */
app.use(
  cors({
    origin: [
      'http://localhost:3000', // react-scripts dev
      'http://localhost:5173', // vite dev
      'http://localhost',      // Docker production (port 80)
    ],
    methods      : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ════════════════════════════════════════════
   ROUTES
   ════════════════════════════════════════════ */

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API Portfolio — Express.js + MongoDB',
    version: '1.0.0',
    endpoints: {
      'GET    /projets'    : 'Lister tous les projets',
      'POST   /projets'    : 'Ajouter un projet',
      'GET    /projets/:id': 'Obtenir un projet par ID',
      'PUT    /projets/:id': 'Modifier un projet',
      'DELETE /projets/:id': 'Supprimer un projet',
    },
  });
});

app.use('/projets', projetRoutes);

/* ════════════════════════════════════════════
   GESTION DES ERREURS
   ════════════════════════════════════════════ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée : ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error('💥 Erreur non gérée :', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne.',
  });
});

/* ════════════════════════════════════════════
   DÉMARRAGE DU SERVEUR
   ════════════════════════════════════════════ */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🚀  API PORTFOLIO — DÉMARRÉE           ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║   Port    : http://localhost:${PORT}          ║`);
  console.log(`║   Env     : ${process.env.NODE_ENV || 'development'}                   ║`);
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
