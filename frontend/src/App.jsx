import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Login from './pages/Login'
import Register from './pages/Register'
import ResultadosBusqueda from './pages/ResultadosBusqueda'
import Settings from './pages/Settings'
import DetallePelicula from './pages/DetallePelicula'

import MainLayout from './layouts/MainLayout'
import NoNavLayout from './layouts/NoNavLayout'
import RutaProtegida from './components/RutaProtegida'
import HomeRedirect from './pages/HomeRedirect'
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomeRedirect />} />
            <Route path='/buscar' element={<ResultadosBusqueda />} />
            <Route path='/settings' element={
              <RutaProtegida>
                <Settings />
              </RutaProtegida>} />
            <Route path='/peliculas/:id' element={<DetallePelicula />} />
          </Route>
          <Route element={<NoNavLayout />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>

  )
}

export default App