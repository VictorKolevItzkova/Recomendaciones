import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App