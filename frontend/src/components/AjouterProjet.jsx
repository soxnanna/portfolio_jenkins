/* =============================================
   AjouterProjet.jsx — Composant AjouterProjet
   Formulaire d'ajout d'un nouveau projet
   ============================================= */

import React, { useState, useRef } from 'react';

function AjouterProjet({ onAjouter, onAnnuler }) {
  const [libelle, setLibelle]     = useState('');
  const [desc, setDesc]           = useState('');
  const [tech, setTech]           = useState('');
  const [preview, setPreview]     = useState('');
  const [loading, setLoading]     = useState(false);
  const fileRef = useRef(null);

  // Aperçu image en temps réel
  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) { setPreview(''); return; }
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!libelle.trim()) return;
    setLoading(true);

    const nouveauProjet = {
      id           : String(Date.now()),
      libelle      : libelle.trim(),
      sourceImage  : preview || '',
      description  : desc.trim(),
      technologie  : tech.trim() || 'Non précisé',
      dateCreation : new Date().toISOString().split('T')[0],
    };

    await onAjouter(nouveauProjet);
    setLoading(false);
  };

  return (
    <div className="view">
      <div className="surface-card">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2>➕ Ajouter un nouveau projet</h2>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="aj-libelle">Libellé du projet *</label>
            <input
              id="aj-libelle"
              type="text"
              placeholder="Ex: Mon site e-commerce"
              value={libelle}
              onChange={e => setLibelle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="aj-image">Image du projet (fichier local)</label>
            <input
              id="aj-image"
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleImage}
            />
            {preview && (
              <img className="image-preview" src={preview} alt="Aperçu" />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="aj-desc">Description *</label>
            <textarea
              id="aj-desc"
              placeholder="Décrivez votre projet..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="aj-tech">Technologies utilisées</label>
            <input
              id="aj-tech"
              type="text"
              placeholder="Ex: React, Node.js, MongoDB"
              value={tech}
              onChange={e => setTech(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Ajout...' : '✅ Ajouter le projet'}
            </button>
            <button type="button" className="btn-cancel" onClick={onAnnuler}>
              ✖ Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjouterProjet;
