import React from 'react';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) onCancel(); }}>
      <div className="modal-box" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div className="modal-header" style={{ justifyContent: 'center' }}>
          <h2 style={{ color: 'var(--danger)' }}>⚠️ {title}</h2>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{message}</p>
        </div>
        <div className="modal-actions" style={{ justifyContent: 'center', border: 'none' }}>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirmer
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
