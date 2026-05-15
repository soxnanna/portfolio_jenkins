/* =============================================
   DetaillerProjet.jsx — Composant DetaillerProjet
   Affiche les infos complètes d'un projet.
   Bouton "Annuler" pour fermer.
   Bouton "Editer" pour ouvrir l'édition.
   ============================================= */

import React, { useState } from 'react';

function DetaillerProjet({ projet, onAnnuler, onEditer, onSauvegarder, modeEditionInitial = false }) {
  const [modeEdition, setModeEdition] = useState(modeEditionInitial);

  // États formulaire d'édition
  const [libelle, setLibelle]   = useState(projet.libelle);
  const [desc, setDesc]         = useState(projet.description || '');
  const [tech, setTech]         = useState(projet.technologie || '');
  const [preview, setPreview]   = useState(projet.sourceImage || '');
  const [loading, setLoading]   = useState(false);

  // Aperçu image édition
  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSauvegarder = async e => {
    e.preventDefault();
    setLoading(true);
    const projetModifie = {
      ...projet,
      libelle     : libelle.trim(),
      sourceImage : preview,
      description : desc.trim(),
      technologie : tech.trim() || 'Non précisé',
    };
    await onSauvegarder(projetModifie);
    setLoading(false);
  };

  // ─── MODE LECTURE ───────────────────────────
  if (!modeEdition) {
    return (
      <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onAnnuler(); }}>
        <div className="modal-box">
          {/* En-tête */}
          <div className="modal-header">
            <h2>{projet.libelle}</h2>
            <button className="btn-close" onClick={onAnnuler} title="Fermer">✕</button>
          </div>

          {/* Image */}
          {projet.sourceImage && (
            <img
              className="modal-img"
              src={projet.sourceImage}
              alt={projet.libelle}
              onError={e => { e.target.onerror=null; e.target.src='https://via.placeholder.com/560x220?text=Image+non+disponible'; }}
            />
          )}

          {/* Corps */}
          <div className="modal-body">
            <p className="modal-desc">{projet.description || 'Aucune description.'}</p>
            <div className="modal-meta">
              {projet.technologie && (
                <span>🛠 <strong>Technologies :</strong> {projet.technologie}</span>
              )}
              {projet.dateCreation && (
                <span>📅 <strong>Date :</strong> {projet.dateCreation}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            {/* Bouton Annuler — ne plus afficher les infos */}
            <button className="btn-cancel" onClick={onAnnuler}>
              ✖ Annuler
            </button>
            {/* Bouton Editer — passe en mode édition */}
            <button className="btn btn-primary" onClick={() => setModeEdition(true)}>
              ✏️ Editer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MODE ÉDITION ───────────────────────────
  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setModeEdition(false); }}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>✏️ Modifier le projet</h2>
          <button className="btn-close" onClick={() => setModeEdition(false)} title="Fermer">✕</button>
        </div>

        <div className="modal-body">
          <form className="form-container" onSubmit={handleSauvegarder}>
            <div className="form-group">
              <label>Libellé *</label>
              <input
                type="text"
                value={libelle}
                onChange={e => setLibelle(e.target.value)}
                required
                placeholder="Nom du projet"
              />
            </div>

            <div className="form-group">
              <label>Image (nouveau fichier optionnel)</label>
              <input type="file" accept="image/*" onChange={handleImage} />
              {preview && <img className="image-preview" src={preview} alt="Aperçu" />}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
                placeholder="Description..."
              />
            </div>

            <div className="form-group">
              <label>Technologies</label>
              <input
                type="text"
                value={tech}
                onChange={e => setTech(e.target.value)}
                placeholder="React, Node.js..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
              </button>
              {/* Retour au mode lecture */}
              <button type="button" className="btn-cancel" onClick={() => setModeEdition(false)}>
                ✖ Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DetaillerProjet;
