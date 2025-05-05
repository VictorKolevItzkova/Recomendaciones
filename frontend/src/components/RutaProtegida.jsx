import { useContext,useState,useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import EsqueletoSettings from '../esqueletos/EsqueletoSettings'

const RutaProtegida = ({ children }) => {
  const { usuario } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <EsqueletoSettings />;
  }
  if (!usuario) {
    return <Navigate to='/' replace />
  }
  return children
}

export default RutaProtegida