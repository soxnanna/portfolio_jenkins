/* =============================================
   Projet.jsx — Composant Projet
   Affiche le libellé et l'image d'un projet
   ainsi qu'un bouton "Supprimer".
   ============================================= */

/* =============================================
   Projet.jsx — Composant de carte individuelle
   Affiche les informations d'un projet du portfolio.
   ============================================= */

import React from 'react';


function Projet({ projet, onSupprimer, onDetailler, onEditer }) {
  const { id, libelle, sourceImage, technologie } = projet;

  return (
    <div className="project-card">
      {/* Image du projet */}
      {sourceImage ? (
        <img
          className="card-img"
          src={sourceImage}
          alt={libelle}
          onError={e => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x160?text=Image+non+disponible';
          }}
        />
      ) : (
        <div className="card-img-placeholder">🖼️</div>
      )}

      <div className="card-body">
        {/* Libellé cliquable → détails */}
        <a
          href="#details"
          className="card-title"
          title="Cliquer pour voir les détails"
          onClick={e => { e.preventDefault(); onDetailler(id); }}
        >
          {libelle}
        </a>

        {/* Technologies */}
        {technologie && (
          <span className="card-tech">{technologie}</span>
        )}

        {/* Actions */}
        <div className="card-actions">
          <button className="btn btn-edit-card" onClick={() => onDetailler(id)}>
            🔍 Détails
          </button>
          <button className="btn btn-edit-card" onClick={() => onEditer(id)}>
            ✏️ Modifier
          </button>
          {/* Bouton Supprimer (requis) */}
          <button className="btn btn-danger" onClick={() => onSupprimer(id)}>
            🗑 Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Projet;
