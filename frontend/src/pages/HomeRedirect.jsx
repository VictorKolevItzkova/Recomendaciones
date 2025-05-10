import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import LandingPage from "./LandingPage";
import RecomendacionPage from "./RecomendacionPage";

const HomeRedirect = () => {
  const { usuario } = useContext(AuthContext);  
  const [esperando, setEsperando] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEsperando(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  if (esperando) {
    return <div></div>;
  }
  return usuario ? <RecomendacionPage /> : <LandingPage />;
};

export default HomeRedirect;