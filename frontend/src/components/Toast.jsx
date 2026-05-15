/* =============================================
   Toast.jsx — Notifications temporaires
   ============================================= */

import React, { useEffect } from 'react';

function Toast({ messages }) {
  return (
    <div className="toast-container">
      {messages.map(m => (
        <div key={m.id} className={`toast ${m.type}`}>
          {m.text}
        </div>
      ))}
    </div>
  );
}

export default Toast;
