/* =============================================
   routes/projetRoutes.js — Définition des Routes
   Relie les endpoints HTTP aux fonctions du contrôleur.
   ============================================= */

/* =============================================
   routes/projetRoutes.js — Module Routes
   Définit les routes REST du portfolio.

   Méthode   URL              Action
   ────────  ───────────────  ─────────────────────
   GET       /projets         Tous les projets
   POST      /projets         Ajouter un projet
   GET       /projets/:id     Un projet par ID
   PUT       /projets/:id     Modifier un projet
   DELETE    /projets/:id     Supprimer un projet
   ============================================= */

const express = require('express');
const router  = express.Router();

const {
  ajouterProjet,
  getTousLesProjets,
  getUnProjet,
  modifierProjet,
  supprimerProjet,
} = require('../controllers/projetController');

/* ── Routes sur la collection (/projets) ── */
router
  .route('/')
  .get(getTousLesProjets)   // GET    /projets
  .post(ajouterProjet);     // POST   /projets

/* ── Routes sur un document (/projets/:id) ── */
router
  .route('/:id')
  .get(getUnProjet)         // GET    /projets/:id
  .put(modifierProjet)      // PUT    /projets/:id
  .delete(supprimerProjet); // DELETE /projets/:id

module.exports = router;
