import { motion } from "framer-motion";
import "../Styles/Footer.css";

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 50 }}   // empieza invisible y abajo
      animate={{ opacity: 1, y: 0 }}    // termina visible en su posición
      transition={{ duration: 1 }}      // duración de la animación
    >
      <p>© 2025 - Portafolio | Proyecto hecho por Ezequiel Moyano</p>
    </motion.footer>
  );
}