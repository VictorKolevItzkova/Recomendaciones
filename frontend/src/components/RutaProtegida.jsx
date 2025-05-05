import { useContext,useState,useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocation,Navigate } from 'react-router-dom'
import EsqueletoSettings from '../esqueletos/EsqueletoSettings'
import EsqueletoDiario from '../esqueletos/EsqueletoDiario'

const RutaProtegida = ({ children }) => {
  const { usuario } = useContext(AuthContext)
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    if (location.pathname === '/settings') {
      return <EsqueletoSettings />
    } else if (location.pathname === '/diario') {
      return <EsqueletoDiario />
    } else {
      return <div>Cargando...</div>
    }
  }

  if (!usuario) {
    return <Navigate to='/' replace />
  }
  return children
}

export default RutaProtegida