import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate,Link } from 'react-router-dom';
import image from '../assets/ai-generated-8848753_1280.jpg'

const Login = () => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      await login(email, password)
      navigate('/')
    } catch (err) {
      console.error("Login fallido", err)
    }

  }

  return (
      <div className="flex h-screen mx-4">
        <Link
        to="/"
        className="absolute left-1/12 top-3 text-2xl font-bold text-white"
      >
        Mi App
      </Link>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:px-16">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-3">Log In</h1>
            <p className="text-gray-300 mb-3">Por favor introduzca sus datos</p>
            <form className="space-y-4 mb-3" action="" onSubmit={handleSubmit}>
              <p className="mb-2 font-bold">Email</p>
              <input className="w-full p-3 border border-cyan-100 rounded-md" type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <p className="mb-2 font-bold">Contraseña</p>
              <input className="w-full p-3 border border-cyan-100 rounded-md" type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="relative w-full inline-flex items-center justify-center p-3 font-medium rounded-md border border-transparent group bg-black/30 overflow-hidden" type="submit">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-md blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></span>
                <span className="relative z-10">Login</span>
              </button>
            </form>
            <p className="text-gray-300 text-center">
              ¿No tienes cuenta?&nbsp;
              <Link className="text-indigo-700 underline">Registrarse</Link>
            </p>
          </div>
        </div>
        <div className="hidden md:flex bg-amber-600 flex-1">
          <h1>H</h1>
        </div>
      </div>
  )
}

export default Login