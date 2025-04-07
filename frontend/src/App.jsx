import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Login from './pages/Login'
import LandingPage from './pages/LandingPage'

import MainLayout from './layouts/MainLayout'
import NoNavLayout from './layouts/NoNavLayout'
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout/>}>
            <Route path='/' element={<LandingPage />} />
          </Route>
          <Route element={<NoNavLayout/>}>
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>

  )
}

export default App