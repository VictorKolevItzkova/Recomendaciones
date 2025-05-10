import { useContext,useState,useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocation,Navigate } from 'react-router-dom'
const RutaProtegida = ({ children }) => {
  const { usuario } = useContext(AuthContext)

  const [esperando, setEsperando] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEsperando(false);
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  if (esperando) {
    return <div></div>;
  }

  if (!usuario) {
    return <Navigate to='/' replace />
  }
  return children
}

export default RutaProtegida