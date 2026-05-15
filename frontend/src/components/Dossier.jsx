/* =============================================
   Dossier.jsx — Composant Dossier
   Gère (stocke, affiche, recherche, filtre)
   la liste des projets.
   ============================================= */

import React, { useState } from 'react';
import Projet from './Projet';
import DetaillerProjet from './DetaillerProjet';

function Dossier({ projets, loading, erreur, onSupprimer, onModifier }) {
  const [recherche, setRecherche]           = useState('');
  const [rechercheDebounced, setDebounced]  = useState('');
  const [projetSelectionne, setSelection]   = useState(null);   // id pour la modale
  const [ouvrirEdition, setOuvrirEdition]   = useState(false);  // ouvre directement l'édition

  // Debounce effect
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(recherche), 300);
    return () => clearTimeout(timer);
  }, [recherche]);

  // ── Recherche (filtre en mémoire) ──────────
  const projetsFiltres = projets.filter(p =>
    p.libelle.toLowerCase().includes(rechercheDebounced.toLowerCase())
  );

  // ── Trouver le projet sélectionné ──────────
  const projetDetail = projets.find(p => String(p.id) === String(projetSelectionne));

  // ── Ouvrir la modale de détail ─────────────
  const handleDetailler = id => {
    setOuvrirEdition(false);
    setSelection(id);
  };

  // ── Ouvrir directement en mode édition ─────
  const handleEditer = id => {
    setOuvrirEdition(true);
    setSelection(id);
  };

  // ── Sauvegarder une modification ───────────
  const handleSauvegarder = async projetModifie => {
    await onModifier(projetModifie);
    setSelection(null);
  };

  return (
    <section className="view">
      {/* ── Barre de recherche ── */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
        />
        {recherche && (
          <button className="btn-clear" onClick={() => setRecherche('')} title="Effacer">✕</button>
        )}
      </div>

      {/* ── Grille des projets ── */}
      <div className="projects-grid">
        {loading && (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-img"></div>
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-line short"></div>
              </div>
            ))}
          </>
        )}

        {erreur && (
          <div className="error-msg">
            ⚠️ Impossible de charger les projets.<br />
            Lance le serveur avec : <code>npx json-server --watch db.json --port 3001</code>
          </div>
        )}

        {!loading && !erreur && projetsFiltres.length === 0 && (
          <div className="empty-state">
            <span>{recherche ? '🔎' : '📂'}</span>
            {recherche
              ? `Aucun projet trouvé pour "${recherche}".`
              : 'Aucun projet pour le moment. Ajoutez-en un !'}
          </div>
        )}

        {/* Instanciation du composant Projet pour chaque projet */}
        {projetsFiltres.map(p => (
          <Projet
            key={p.id}
            projet={p}
            onDetailler={handleDetailler}
            onEditer={handleEditer}
            onSupprimer={onSupprimer}
          />
        ))}
      </div>

      {/* ── Modale DetaillerProjet ── */}
      {projetDetail && (
        <DetaillerProjet
          key={projetDetail.id + '-' + ouvrirEdition}
          projet={projetDetail}
          onAnnuler={() => setSelection(null)}
          onEditer={() => setOuvrirEdition(true)}
          onSauvegarder={handleSauvegarder}
          /* Si on clique sur Modifier depuis une carte, on passe directement en édition */
          modeEditionInitial={ouvrirEdition}
        />
      )}
    </section>
  );
}

export default Dossier;
