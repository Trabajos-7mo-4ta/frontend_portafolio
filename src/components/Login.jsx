import { useState, useContext } from "react";
import "../Styles/Login.css";
import { AdminContext } from "../contexts/AdminContext";

export default function Login({ onClose }) {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const { setAdmin } = useContext(AdminContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-portafolio-rlqp.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contraseña }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "Error desconocido");
        return;
      }

      setError("");
      setAdmin(true); // activa modo admin
      onClose();      // cierra modal
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>
        <h2>Login Administrador</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}