import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import LandingPage from "./LandingPage";
import RecomendacionPage from "./RecomendacionPage";

const HomeRedirect = () => {
  const { usuario } = useContext(AuthContext);  
  const [esperando, setEsperando] = useState(true);

  useEffect(() => {
    // Aplica un delay antes de mostrar cualquier contenido
    const timeout = setTimeout(() => {
      setEsperando(false);
    }, 50); // 500ms de delay, ajústalo a lo que necesites

    return () => clearTimeout(timeout);
  }, []);

  if (esperando) {
    return <div></div>; // o un loader/spinner si lo deseas
  }
  return usuario ? <RecomendacionPage /> : <LandingPage />;
};

export default HomeRedirect;