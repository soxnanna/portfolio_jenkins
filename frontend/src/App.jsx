/* =============================================
   App.jsx — Composant racine SPA Portfolio
   Orchestre la navigation et les composants :
   Dossier, AjouterProjet, DetaillerProjet
   ============================================= */

/* =============================================
   App.jsx — Composant Racine du Portfolio
   Gère l'état global et les interactions CRUD.
   ============================================= */

import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from './api';
import Dossier        from './components/Dossier';
import AjouterProjet  from './components/AjouterProjet';
import Toast          from './components/Toast';
import ConfirmModal   from './components/ConfirmModal';

/* ── Vues disponibles ── */
const VUES = { ACCUEIL: 'accueil', AJOUTER: 'ajouter', CONTACT: 'contact' };

function App() {
  /* ── État global : liste des projets ── */
  const [projets,  setProjets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [erreur,   setErreur]   = useState(false);

  /* ── Navigation SPA ── */
  const [vue, setVue] = useState(VUES.ACCUEIL);

  /* ── Notifications toast ── */
  const [toasts, setToasts] = useState([]);
  
  /* ── Mode Sombre ── */
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  /* ── État Modale Confirmation ── */
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const afficherToast = useCallback((text, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  /* ────────────────────────────────────────────
     CHARGEMENT INITIAL — GET /projets
  ──────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErreur(false);
        const data = await apiService.getAll();
        setProjets(data);
      } catch {
        setErreur(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ────────────────────────────────────────────
     AJOUTER UN PROJET — POST /projets
  ──────────────────────────────────────────── */
  const handleAjouter = async nouveauProjet => {
    try {
      const sauvegarde = await apiService.create(nouveauProjet);
      // Insérer en tête de liste (prepend)
      setProjets(prev => [sauvegarde, ...prev]);
      setVue(VUES.ACCUEIL);
      afficherToast('✅ Projet ajouté avec succès !', 'success');
    } catch {
      afficherToast('❌ Erreur lors de l\'ajout.', 'error');
    }
  };

  /* ────────────────────────────────────────────
     SUPPRIMER UN PROJET — DELETE /projets/:id
  ──────────────────────────────────────────── */
  const lancerSuppression = id => setConfirmDelete({ isOpen: true, id });

  const handleSupprimer = async () => {
    const id = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    try {
      await apiService.remove(id);
      setProjets(prev => prev.filter(p => String(p.id) !== String(id)));
      afficherToast('🗑 Projet supprimé.', 'info');
    } catch {
      afficherToast('❌ Erreur lors de la suppression.', 'error');
    }
  };

  /* ────────────────────────────────────────────
     MODIFIER UN PROJET — PUT /projets/:id
  ──────────────────────────────────────────── */
  const handleModifier = async projetModifie => {
    try {
      const mis_a_jour = await apiService.update(projetModifie.id, projetModifie);
      setProjets(prev =>
        prev.map(p => String(p.id) === String(mis_a_jour.id) ? mis_a_jour : p)
      );
      afficherToast('💾 Projet modifié avec succès !', 'success');
    } catch {
      afficherToast('❌ Erreur lors de la modification.', 'error');
    }
  };

  /* ────────────────────────────────────────────
     RENDU
  ──────────────────────────────────────────── */
  return (
    <>
      {/* ── HEADER / NAVIGATION SPA ── */}
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">💼</span>
          <span>Mon Portfolio</span>
        </div>

        <nav className="nav">
          <button 
            className="nav-btn" 
            onClick={() => setIsDark(!isDark)} 
            title="Changer de thème"
            style={{ fontSize: '1.2rem', padding: '0.5rem' }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            className={`nav-btn ${vue === VUES.ACCUEIL ? 'active' : ''}`}
            onClick={() => setVue(VUES.ACCUEIL)}
          >
            🏠 Accueil
          </button>
          <button
            className={`nav-btn ${vue === VUES.AJOUTER ? 'active' : ''}`}
            onClick={() => setVue(VUES.AJOUTER)}
          >
            ➕ Ajouter
          </button>
          <button
            className={`nav-btn ${vue === VUES.CONTACT ? 'active' : ''}`}
            onClick={() => setVue(VUES.CONTACT)}
          >
            ✉️ Contact
          </button>
        </nav>
      </header>

      {/* ── MAIN ── */}
      <main>

        {/* ══════════════════════════════════════
            VUE ACCUEIL — Composant Dossier
        ══════════════════════════════════════ */}
        {vue === VUES.ACCUEIL && (
          <div className="view">
            {/* Hero */}
            <div className="hero">
              <h1>Bienvenue sur mon Portfolio</h1>
              <p>Découvrez mes projets et compétences en développement web, mobile et design</p>
            </div>

            {/* Section projets avec badge compteur */}
            <div className="surface-card">
              <div className="section-header">
                <h2>Mes Projets</h2>
                <span className="badge">
                  {projets.length} projet{projets.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* ── Composant Dossier : gère la liste ── */}
              <Dossier
                projets={projets}
                loading={loading}
                erreur={erreur}
                onSupprimer={lancerSuppression}
                onModifier={handleModifier}
              />
            </div>

            {/* Compétences */}
            <div className="surface-card">
              <h2 style={{ marginBottom: '1rem' }}>Compétences</h2>
              <ul className="skills-list">
                <li>🌐 Développement Web : HTML, CSS, JavaScript, React, Node.js</li>
                <li>📱 Développement Mobile : Flutter, React Native</li>
                <li>🎨 Design : Figma, Adobe XD</li>
                <li>🔐 Réseaux : CCNA, LDAP, XMPP, Active Directory</li>
              </ul>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            VUE AJOUTER — Composant AjouterProjet
        ══════════════════════════════════════ */}
        {vue === VUES.AJOUTER && (
          <AjouterProjet
            onAjouter={handleAjouter}
            onAnnuler={() => setVue(VUES.ACCUEIL)}
          />
        )}

        {/* ══════════════════════════════════════
            VUE CONTACT
        ══════════════════════════════════════ */}
        {vue === VUES.CONTACT && (
          <div className="view">
            <div className="surface-card">
              <h2 style={{ marginBottom: '0.75rem' }}>✉️ Contactez-moi</h2>
              <p>
                Vous pouvez me contacter par email à{' '}
                <a href="mailto:soxnanna@gmail.com" className="contact-email">
                  soxnanna@gmail.com
                </a>
              </p>
            </div>

            <div className="surface-card">
              <h2 style={{ marginBottom: '0.75rem' }}>🌐 Réseaux Sociaux</h2>
              <div className="social-links">
                <a
                  href="https://www.linkedin.com/in/anna-keita-1a83052aa/"
                  className="social-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  🔗 LinkedIn
                </a>
                <a
                  href="https://github.com/soxnanna/"
                  className="social-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  🐱 GitHub
                </a>
                <a
                  href="https://twitter.com/monprofil"
                  className="social-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  🐦 Twitter
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer>
        <p>© 2026 G4 Fullstack Portfolio — React SPA</p>
      </footer>

      {/* ── TOASTS ── */}
      <Toast messages={toasts} />

      {/* ── MODALE CONFIRMATION ── */}
      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title="Supprimer le projet ?"
        message="Cette action est irréversible."
        onConfirm={handleSupprimer}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </>
  );
}

export default App;
