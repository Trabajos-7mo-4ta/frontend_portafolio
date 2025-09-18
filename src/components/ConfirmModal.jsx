import React from "react";
import "../Styles/ConfirmModal.css"; // Estilos opcionales

export default function ConfirmModal({ mensaje, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <p>{mensaje}</p>
        <div className="modal-buttons">
          <button className="modal-btn confirm" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="modal-btn cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
