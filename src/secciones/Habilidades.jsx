import { useState, useEffect, useContext } from "react";
import "../Styles/Habilidades.css";
import { AdminContext } from "../contexts/AdminContext";
import ConfirmModal from "../components/ConfirmModal";

export default function Habilidades() {
  const { admin } = useContext(AdminContext);
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null); 
  const [skillInput, setSkillInput] = useState(""); 
  const [error, setError] = useState(""); // NUEVO

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const fetchSkills = async () => {
    try {
      const res = await fetch("https://backend-portafolio-rlqp.onrender.com/habilidades");
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error("Error al obtener habilidades:", err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleGuardar = async () => {
    // VALIDACIONES
    if (!skillInput.trim()) {
      setError("El campo es obligatorio.");
      return;
    }
    if (/^\d+$/.test(skillInput)) {
      setError("La habilidad no puede ser solo números.");
      return;
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,()\-]+$/.test(skillInput)) {
      setError(
        "Solo se permiten letras (con acentos), números, espacios y , . ( ) -"
      );
      return;
    }

    setError(""); // limpiar error si pasa validaciones

    try {
      if (editingSkill) {
        const res = await fetch(
          `https://backend-portafolio-rlqp.onrender.com/habilidades/${editingSkill.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: skillInput }),
          }
        );
        if (!res.ok) throw new Error("Error al actualizar habilidad");
      } else {
        const res = await fetch("https://backend-portafolio-rlqp.onrender.com/habilidades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: skillInput }),
        });
        if (!res.ok) throw new Error("Error al agregar habilidad");
      }

      setSkillInput("");
      setEditingSkill(null);
      fetchSkills(); 
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la habilidad.");
    }
  };

  const handleEditar = (skill) => {
    setEditingSkill(skill);
    setSkillInput(skill.nombre);
    setError("");
  };

  const handleMostrarConfirmacion = (id) => {
    setIdAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      const res = await fetch(
        `https://backend-portafolio-rlqp.onrender.com/habilidades/${idAEliminar}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar habilidad");
      setMostrarConfirmacion(false);
      setIdAEliminar(null);
      fetchSkills();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la habilidad.");
    }
  };

  const handleCancelar = () => {
    setEditingSkill(null);
    setSkillInput("");
    setError("");
  };

  return (
    <>
      <section id="habilidades" className="habilidades" data-aos="fade-down">
        <div className="contenedor">
          <h2>Habilidades</h2>

          <ul>
            {skills.length > 0 ? (
              skills.map((skill) => (
                <li key={skill.id}>
                  {skill.nombre}
                  {admin && (
                    <div className="buttons-container">
                      <button
                        onClick={() => handleEditar(skill)}
                        className="admin-btn"
                        style={{ marginLeft: "10px" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleMostrarConfirmacion(skill.id)}
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
              <p>No hay habilidades aún</p>
            )}
          </ul>

          {admin && (
            <div className="skill-form">
              <input
                type="text"
                placeholder="Nueva habilidad"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />

              {error && <p className="error-msg">{error}</p>} {/* ERROR */}

              <button onClick={handleGuardar} className="admin-btn">
                {editingSkill ? "Actualizar" : "Agregar"}
              </button>
              {editingSkill && (
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
          mensaje="¿Seguro que deseas eliminar esta habilidad?"
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