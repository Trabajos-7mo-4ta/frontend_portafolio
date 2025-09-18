import './App.css'
import Header from "./components/Header";
import Footer from "./components/Footer";

import SobreMi from "./secciones/SobreMi";
import Logros from "./secciones/Logros";
import Experiencia from "./secciones/Experiencia";
import Proyectos from "./secciones/Proyectos";
import Habilidades from './secciones/Habilidades';

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { AdminProvider } from "./contexts/AdminContext";

function App() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <AdminProvider>
      <Header />
      <main>
        <SobreMi />
        <Habilidades />
        <Logros />
        <Experiencia />
        <Proyectos />
      </main>
      <Footer />
    </AdminProvider>
  );
}

export default App;