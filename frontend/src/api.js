/* =============================================
   api.js — Couche de service Frontend
   Gère toutes les communications avec l'API REST.

   En développement (react-scripts) : proxy dans package.json
   redirige /projets → http://localhost:3001
   En production Docker : Nginx proxy /projets → http://backend:3001
   ============================================= */

const API_URL = '/projets';

export const apiService = {

  /* ── GET /projets ─────────────────────────
     Retourner tous les projets               */
  async getAll(search = '') {
    const url = search
      ? `${API_URL}?search=${encodeURIComponent(search)}`
      : API_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Serveur non disponible');
    const json = await res.json();
    return json.data ?? json;
  },

  /* ── POST /projets ────────────────────────
     Ajouter un nouveau projet                */
  async create(projet) {
    const res = await fetch(API_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(projet),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Erreur lors de la création');
    return json.data ?? json;
  },

  /* ── GET /projets/:id ─────────────────────
     Retourner un projet par son ID           */
  async getOne(id) {
    const res  = await fetch(`${API_URL}/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Projet introuvable');
    return json.data ?? json;
  },

  /* ── PUT /projets/:id ─────────────────────
     Modifier un projet existant              */
  async update(id, projet) {
    const res = await fetch(`${API_URL}/${id}`, {
      method : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(projet),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Erreur lors de la mise à jour');
    return json.data ?? json;
  },

  /* ── DELETE /projets/:id ──────────────────
     Supprimer un projet                      */
  async remove(id) {
    const res  = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Erreur lors de la suppression');
    return true;
  },
};
