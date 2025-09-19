import { useState, useEffect, useContext } from "react";
import "../Styles/SobreMi.css";
import { AdminContext } from "../contexts/AdminContext";

export default function SobreMi() {
  const { admin } = useContext(AdminContext);
  const [contenido, setContenido] = useState("");
  const [editing, setEditing] = useState(false);
  const [nuevoContenido, setNuevoContenido] = useState("");
  const [error, setError] = useState(""); // NUEVO

  const fetchContenido = async () => {
    try {
      const res = await fetch("https://backend-portafolio-rlqp.onrender.com/sobre_mi");
      if (!res.ok) throw new Error("Error al obtener contenido");
      const data = await res.json();

      if (data.length > 0) {
        setContenido(data[0].contenido);
        setNuevoContenido(data[0].contenido);
      } else {
        setContenido("Sin información");
        setNuevoContenido("");
      }
    } catch (err) {
      console.error(err);
      setContenido("Sin información");
    }
  };

  useEffect(() => {
    fetchContenido();
  }, []);

  const handleGuardar = async () => {
    // VALIDACIONES
    if (!nuevoContenido.trim()) {
      setError("El campo es obligatorio.");
      return;
    }
    if (/^\d+$/.test(nuevoContenido)) {
      setError("El contenido no puede ser solo números.");
      return;
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,()\-]+$/.test(nuevoContenido)) {
      setError(
        "Solo se permiten letras (con acentos), números, espacios y , . ( ) -"
      );
      return;
    }

    setError(""); // limpiar error si pasa validaciones

    try {
      await fetch(`https://backend-portafolio-rlqp.onrender.com/sobre_mi/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: nuevoContenido }),
      });
      setContenido(nuevoContenido || "Sin información");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el contenido.");
    }
  };

  return (
    <section id="sobreMi" className="sobreMi" data-aos="fade-down">
      <div className="contenedor">
        <h2>Sobre mí</h2>

        {editing ? (
          <>
            <textarea
              value={nuevoContenido}
              onChange={(e) => setNuevoContenido(e.target.value)}
              rows={5}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            {error && <p className="error-msg">{error}</p>} {/* ERROR */}
            <button onClick={handleGuardar} className="admin-btn">
              Guardar
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              className="admin-btn"
              style={{ marginLeft: "10px", background: "#888" }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <p>{contenido || "Cargando contenido..."}</p>
            {admin && (
              <button onClick={() => setEditing(true)} className="admin-btn">
                Editar
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );

}
