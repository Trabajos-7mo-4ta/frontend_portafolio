import { useState, useContext } from "react";
import { motion } from "framer-motion";
import "../Styles/Header.css";
import Login from "./Login";
import { AdminContext } from "../contexts/AdminContext";

export default function Header() {
  const { admin, setAdmin } = useContext(AdminContext);
  const [showLogin, setShowLogin] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => setAdmin(false);

  return (
    <>
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="titulo">Portafolio</h1>

        {/* Botón hamburguesa */}
        <button
          className={`hamburger ${menuAbierto ? "open" : ""}`}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navegación */}
        <nav className={`nav ${menuAbierto ? "open" : ""}`}>
          <a href="#sobreMi" onClick={() => setMenuAbierto(false)}>Sobre mí</a>
          <a href="#habilidades" onClick={() => setMenuAbierto(false)}>Habilidades</a>
          <a href="#logros" onClick={() => setMenuAbierto(false)}>Logros</a>
          <a href="#experiencia" onClick={() => setMenuAbierto(false)}>Experiencia</a>
          <a href="#proyectos" onClick={() => setMenuAbierto(false)}>Proyectos</a>
          {admin ? (
            <button onClick={handleLogout} className="admin-btn">
              Cerrar Sesión
            </button>
          ) : (
            <button onClick={() => { setShowLogin(true); setMenuAbierto(false); }} className="admin-btn">
              Admin
            </button>
          )}
        </nav>
      </motion.header>

      {showLogin && !admin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
}