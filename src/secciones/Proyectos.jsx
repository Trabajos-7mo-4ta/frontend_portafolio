import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import "../Styles/Proyectos.css";
import { AdminContext } from "../contexts/AdminContext";
import ConfirmModal from "../components/ConfirmModal";

export default function Proyectos() {
  const { admin } = useContext(AdminContext);
  const [proyectos, setProyectos] = useState([]);
  const [editingProj, setEditingProj] = useState(null);
  const [projInput, setProjInput] = useState({ nombre: "", descripcion: "" });
  const [error, setError] = useState(""); // NUEVO

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const fetchProyectos = async () => {
    try {
      const res = await fetch("https://backend-portafolio-rlqp.onrender.com/proyectos");
      const data = await res.json();
      setProyectos(data);
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleGuardar = async () => {
    // VALIDACIONES
    if (!projInput.nombre.trim() || !projInput.descripcion.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (/^\d+$/.test(projInput.nombre) || /^\d+$/.test(projInput.descripcion)) {
      setError("El nombre y la descripción no pueden ser solo números.");
      return;
    }
    if (
      !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,()\-]+$/.test(projInput.nombre) ||
      !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,()\-]+$/.test(projInput.descripcion)
    ) {
      setError("Solo se permiten letras (con acentos), números, espacios y , . ( ) -");
      return;
    }

    setError(""); // limpiar error si pasa validaciones

    try {
      if (editingProj) {
        const res = await fetch(`https://backend-portafolio-rlqp.onrender.com/proyectos/${editingProj.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projInput),
        });
        if (!res.ok) throw new Error("Error al actualizar proyecto");
      } else {
        const res = await fetch("https://backend-portafolio-rlqp.onrender.com/proyectos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projInput),
        });
        if (!res.ok) throw new Error("Error al agregar proyecto");
      }

      setProjInput({ nombre: "", descripcion: "" });
      setEditingProj(null);
      fetchProyectos();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el proyecto.");
    }
  };

  const handleEditar = (proj) => {
    setEditingProj(proj);
    setProjInput({ nombre: proj.nombre, descripcion: proj.descripcion });
  };

  const handleMostrarConfirmacion = (id) => {
    setIdAEliminar(id);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      const res = await fetch(`https://backend-portafolio-rlqp.onrender.com/proyectos/${idAEliminar}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar proyecto");
      setMostrarConfirmacion(false);
      setIdAEliminar(null);
      fetchProyectos();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el proyecto.");
    }
  };

  const handleCancelar = () => {
    setEditingProj(null);
    setProjInput({ nombre: "", descripcion: "" });
    setError("");
  };

  return (
    <>
      <section id="proyectos" className="proyectos" data-aos="fade-down">
        <div className="contenedor">
          <h2>Proyectos</h2>

          {proyectos.length > 0 ? (
            proyectos.map((proyecto, index) => (
              <motion.div
                key={proyecto.id}
                className="proyecto-card"
                whileHover={{
                  scale: 1.05,
                  rotateX: index % 2 === 0 ? 8 : -8,
                  rotateY: index % 2 === 0 ? -8 : 8,
                  boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <h3>{proyecto.nombre}</h3>
                <p>{proyecto.descripcion}</p>
                {admin && (
                  <div className="buttons-container">
                    <button
                      onClick={() => handleEditar(proyecto)}
                      className="admin-btn"
                      style={{ marginRight: "5px" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleMostrarConfirmacion(proyecto.id)}
                      className="admin-btn"
                      style={{ background: "#c62828" }}
                    >
                      Borrar
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <p>Cargando proyectos...</p>
          )}

          {admin && (
            <div className="proj-form">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={projInput.nombre}
                onChange={(e) => setProjInput({ ...projInput, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={projInput.descripcion}
                onChange={(e) => setProjInput({ ...projInput, descripcion: e.target.value })}
              />
              {error && <p className="error-msg">{error}</p>} {/* ERROR */}
              <button onClick={handleGuardar} className="admin-btn">
                {editingProj ? "Actualizar" : "Agregar"}
              </button>
              {editingProj && (
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
          mensaje="¿Seguro que deseas eliminar este proyecto?"
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
