import { useState, useEffect, useContext } from "react";
import "../Styles/Logros.css";
import { AdminContext } from "../contexts/AdminContext";
import ConfirmModal from "../components/ConfirmModal";

export default function Logros() {
  const { admin } = useContext(AdminContext);
  const [logros, setLogros] = useState([]);
  const [editingLogro, setEditingLogro] = useState(null);
  const [logroInput, setLogroInput] = useState("");
  const [error, setError] = useState(""); // NUEVO

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const fetchLogros = async () => {
    try {
      const res = await fetch("https://backend-portafolio-rlqp.onrender.com/logros");
      const data = await res.json();
      setLogros(data);
    } catch (err) {
      console.error("Error al obtener logros:", err);
    }
  };

  useEffect(() => {
    fetchLogros();
  }, []);

  const handleGuardar = async () => {
    // VALIDACIONES
    if (!logroInput.trim()) {
      setError("El campo es obligatorio.");
      return;
    }
    if (/^\d+$/.test(logroInput)) {
      setError("El logro no puede ser solo números.");
      return;
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,()\-]+$/.test(logroInput)) {
      setError(
        "Solo se permiten letras (con acentos), números, espacios y , . ( ) -"
      );
      return;
    }

    setError(""); // limpiar error si pasa validaciones

    try {
      if (editingLogro) {
        const res = await fetch(
          `https://backend-portafolio-rlqp.onrender.com/logros/${editingLogro.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion: logroInput }),
          }
        );
        if (!res.ok) throw new Error("Error al actualizar logro");
      } else {
        const res = await fetch("https://backend-portafolio-rlqp.onrender.com/logros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ descripcion: logroInput }),
        });
        if (!res.ok) throw new Error("Error al agregar logro");
      }

      setLogroInput("");
      setEditingLogro(null);
      fetchLogros();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el logro.");
    }
  };

  const handleEditar = (logro) => {
    setEditingLogro(logro);
    setLogroInput(logro.descripcion);
    setError("");
  };

  const handleMostrarConfirmacion = (id) => {
    setIdAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      const res = await fetch(`https://backend-portafolio-rlqp.onrender.com/logros/${idAEliminar}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar logro");
      setMostrarConfirmacion(false);
      setIdAEliminar(null);
      fetchLogros();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el logro.");
    }
  };

  const handleCancelar = () => {
    setEditingLogro(null);
    setLogroInput("");
    setError("");
  };

  return (
    <>
      <section id="logros" className="logros" data-aos="fade-up">
        <div className="contenedor">
          <h2>Logros</h2>

          <ul>
            {logros.length > 0 ? (
              logros.map((logro) => (
                <li key={logro.id}>
                  {logro.descripcion}
                  {admin && (
                    <div className="buttons-container">
                      <button
                        onClick={() => handleEditar(logro)}
                        className="admin-btn"
                        style={{ marginLeft: "10px" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleMostrarConfirmacion(logro.id)}
                        className="admin-btn"
                        style={{ marginLeft: "5px", background: "#c62828" }}
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p>Cargando logros...</p>
            )}
          </ul>

          {admin && (
            <div className="logro-form">
              <input
                type="text"
                placeholder="Nuevo logro"
                value={logroInput}
                onChange={(e) => setLogroInput(e.target.value)}
              />

              {error && <p className="error-msg">{error}</p>} {/* ERROR */}

              <button onClick={handleGuardar} className="admin-btn">
                {editingLogro ? "Actualizar" : "Agregar"}
              </button>
              {editingLogro && (
                <button
                  onClick={handleCancelar}
                  className="admin-btn"
                  style={{ marginLeft: "10px", background: "#888" }}
                >
                  Cancelar
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {mostrarConfirmacion && (
        <ConfirmModal
          mensaje="¿Seguro que deseas eliminar este logro?"
          onConfirm={handleConfirmarEliminar}
          onCancel={() => {
            setMostrarConfirmacion(false);
            setIdAEliminar(null);
          }}
        />
      )}
    </>
  );

}
