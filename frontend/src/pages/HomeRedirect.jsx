import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LandingPage from "./LandingPage";
import RecomendacionPage from "./RecomendacionPage";

const HomeRedirect = () => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return <LandingPage />;
  }

  return <RecomendacionPage />;
};

export default HomeRedirect;