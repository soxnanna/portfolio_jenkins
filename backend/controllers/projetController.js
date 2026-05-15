/* =============================================
   controllers/projetController.js
   Logique métier pour la gestion des projets.
   Utilise le modèle Mongoose 'Projet'.
   ============================================= */

const Projet = require('../models/projetModel');

/* ──────────────────────────────────────────────
   AJOUTER UN PROJET
   POST /projets
   Body JSON : { libelle, sourceImage, description, technologie, dateCreation }
────────────────────────────────────────────── */
const ajouterProjet = async (req, res) => {
  try {
    const { libelle, sourceImage, description, technologie, dateCreation } = req.body;

    /* Validation manuelle des champs obligatoires */
    if (!libelle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Les champs "libelle" et "description" sont obligatoires.',
      });
    }

    /* Création du document MongoDB */
    const nouveauProjet = await Projet.create({
      libelle,
      sourceImage : sourceImage  || '',
      description,
      technologie : technologie  || 'Non précisé',
      dateCreation: dateCreation || new Date().toISOString().split('T')[0],
    });

    return res.status(201).json({
      success: true,
      message: 'Projet ajouté avec succès.',
      data   : nouveauProjet,
    });
  } catch (error) {
    /* Erreur de validation Mongoose */
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(' | ') });
    }
    console.error('[ajouterProjet]', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur interne.' });
  }
};

/* ──────────────────────────────────────────────
   RETOURNER TOUS LES PROJETS
   GET /projets
   Query optionnelle : ?search=mot   (recherche dans libelle)
────────────────────────────────────────────── */
/**
 * getTousLesProjets — GET /projets
 * Récupère la liste de tous les projets avec support de recherche.
 */
const getTousLesProjets = async (req, res) => {
  try {
    const { search } = req.query;
    let filtre = {};

    /* Recherche insensible à la casse dans le libellé */
    if (search && search.trim()) {
      filtre = {
        $or: [
          { libelle     : { $regex: search.trim(), $options: 'i' } },
          { technologie : { $regex: search.trim(), $options: 'i' } },
        ],
      };
    }

    /* Tri du plus récent au plus ancien */
    const projets = await Projet.find(filtre).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total  : projets.length,
      data   : projets,
    });
  } catch (error) {
    console.error('[getTousLesProjets]', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur interne.' });
  }
};

/* ──────────────────────────────────────────────
   RETOURNER UN PROJET PAR ID
   GET /projets/:id
────────────────────────────────────────────── */
/**
 * getUnProjet — GET /projets/:id
 * Récupère un projet unique via son ID MongoDB.
 */
const getUnProjet = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);

    if (!projet) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'id : ${req.params.id}`,
      });
    }

    return res.status(200).json({ success: true, data: projet });
  } catch (error) {
    /* ID MongoDB malformé */
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Identifiant invalide.' });
    }
    console.error('[getUnProjet]', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur interne.' });
  }
};

/* ──────────────────────────────────────────────
   MODIFIER UN PROJET
   PUT /projets/:id
   Body JSON : champs à mettre à jour
────────────────────────────────────────────── */
/**
 * modifierProjet — PUT /projets/:id
 * Met à jour les champs d'un projet existant.
 */
const modifierProjet = async (req, res) => {
  try {
    const { libelle, sourceImage, description, technologie, dateCreation } = req.body;

    /* Construire l'objet de mise à jour avec uniquement les champs fournis */
    const champsMaj = {};
    if (libelle      !== undefined) champsMaj.libelle      = libelle;
    if (sourceImage  !== undefined) champsMaj.sourceImage  = sourceImage;
    if (description  !== undefined) champsMaj.description  = description;
    if (technologie  !== undefined) champsMaj.technologie  = technologie;
    if (dateCreation !== undefined) champsMaj.dateCreation = dateCreation;

    if (Object.keys(champsMaj).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun champ à mettre à jour fourni.',
      });
    }

    const projetModifie = await Projet.findByIdAndUpdate(
      req.params.id,
      champsMaj,
      {
        new           : true,  // retourner le document mis à jour
        runValidators : true,  // appliquer les validations du schéma
      }
    );

    if (!projetModifie) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'id : ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Projet modifié avec succès.',
      data   : projetModifie,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Identifiant invalide.' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(' | ') });
    }
    console.error('[modifierProjet]', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur interne.' });
  }
};

/* ──────────────────────────────────────────────
   SUPPRIMER UN PROJET
   DELETE /projets/:id
────────────────────────────────────────────── */
/**
 * supprimerProjet — DELETE /projets/:id
 * Supprime définitivement un projet de la base de données.
 */
const supprimerProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);

    if (!projet) {
      return res.status(404).json({
        success: false,
        message: `Aucun projet trouvé avec l'id : ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Projet supprimé avec succès.',
      data   : { id: req.params.id },
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Identifiant invalide.' });
    }
    console.error('[supprimerProjet]', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur interne.' });
  }
};

module.exports = {
  ajouterProjet,
  getTousLesProjets,
  getUnProjet,
  modifierProjet,
  supprimerProjet,
};
