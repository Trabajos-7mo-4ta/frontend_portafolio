import { useState, useEffect, useContext } from "react";
import "../Styles/Experiencia.css";
import { AdminContext } from "../contexts/AdminContext";
import ConfirmModal from "../components/ConfirmModal";

export default function Experiencia() {
  const { admin } = useContext(AdminContext);
  const [experiencias, setExperiencias] = useState([]);
  const [editingExp, setEditingExp] = useState(null);
  const [expInput, setExpInput] = useState({ titulo: "", descripcion: "" });
  const [error, setError] = useState(""); // NUEVO

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Traer experiencias
  const fetchExperiencias = async () => {
    try {
      const res = await fetch("http://localhost:3001/experiencia");
      const data = await res.json();
      setExperiencias(data);
    } catch (err) {
      console.error("Error al obtener experiencia:", err);
    }
  };

  useEffect(() => {
    fetchExperiencias();
  }, []);

  // Guardar o actualizar experiencia
  const handleGuardar = async () => {
    // VALIDACIONES
    if (!expInput.titulo.trim() || !expInput.descripcion.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (/^\d+$/.test(expInput.titulo) || /^\d+$/.test(expInput.descripcion)) {
      setError("El título y la descripción no pueden ser solo números.");
      return;
    }
    if (
      !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,()\-]+$/.test(expInput.titulo) ||
      !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,()\-]+$/.test(expInput.descripcion)
    ) {
      setError(
        "Solo se permiten letras (con acentos), números, espacios y , . ( ) -"
      );
      return;
    }

    setError(""); // limpiar error si pasa validaciones

    try {
      if (editingExp) {
        const res = await fetch(
          `http://localhost:3001/experiencia/${editingExp.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expInput),
          }
        );
        if (!res.ok) throw new Error("Error al actualizar experiencia");
      } else {
        const res = await fetch("http://localhost:3001/experiencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expInput),
        });
        if (!res.ok) throw new Error("Error al agregar experiencia");
      }

      setExpInput({ titulo: "", descripcion: "" });
      setEditingExp(null);
      fetchExperiencias();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la experiencia.");
    }
  };

  // Editar experiencia
  const handleEditar = (exp) => {
    setEditingExp(exp);
    setExpInput({ titulo: exp.titulo, descripcion: exp.descripcion });
  };

  // Mostrar modal antes de eliminar
  const handleMostrarConfirmacion = (id) => {
    setIdAEliminar(id);
    setMostrarConfirmacion(true);
  };

  // Confirmar eliminación
  const handleConfirmarEliminar = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/experiencia/${idAEliminar}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Error al eliminar experiencia");
      setMostrarConfirmacion(false);
      setIdAEliminar(null);
      fetchExperiencias(); // refrescar lista
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la experiencia.");
    }
  };

  // Cancelar edición
  const handleCancelar = () => {
    setEditingExp(null);
    setExpInput({ titulo: "", descripcion: "" });
    setError("");
  };

  return (
    <>
      <section id="experiencia" className="experiencia" data-aos="fade-up">
        <div className="contenedor">
          <h2>Experiencia</h2>

          {experiencias.length > 0 ? (
            experiencias.map((exp) => (
              <div key={exp.id} className="exp-item">
                <h3>{exp.titulo}</h3>
                <p>{exp.descripcion}</p>
                {admin && (
                  <div className="buttons-container">
                    <button
                      onClick={() => handleEditar(exp)}
                      className="admin-btn"
                      style={{ marginRight: "5px" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleMostrarConfirmacion(exp.id)}
                      className="admin-btn"
                      style={{ background: "#c62828" }}
                    >
                      Borrar
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Cargando experiencia...</p>
          )}

          {admin && (
            <div className="exp-form">
              <input
                type="text"
                placeholder="Título"
                value={expInput.titulo}
                onChange={(e) =>
                  setExpInput({ ...expInput, titulo: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Descripción"
                value={expInput.descripcion}
                onChange={(e) =>
                  setExpInput({ ...expInput, descripcion: e.target.value })
                }
              />

              {error && <p className="error-msg">{error}</p>} {/* ERROR */}

              <button
                type="button"
                onClick={handleGuardar}
                className="admin-btn"
              >
                {editingExp ? "Actualizar" : "Agregar"}
              </button>
              {editingExp && (
                <button
                  type="button"
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
          mensaje="¿Seguro que deseas eliminar esta experiencia?"
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