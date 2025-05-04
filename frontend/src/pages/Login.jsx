import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from 'react-router-dom';
import image from '../assets/ai-generated-8848753_1280.jpg'
import InputField from "../components/InputField";
const Login = () => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err)
    }

  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="w-full px-6 py-4 flex items-center justify-center md:justify-start bg-transparent">
        <Link to="/" className="md:ml-32 text-2xl font-bold text-white">MatchIT</Link>
      </nav>

      <div className="flex flex-1">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:px-16">
          <div className="w-full max-w-md px-4">
            <h1 className="text-3xl font-bold mb-3">Log In</h1>
            <p className="text-slate-300 mb-3">Por favor introduzca sus datos</p>
            <form className="space-y-4 mb-3" action="" onSubmit={handleSubmit}>
              <InputField label="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />

              <InputField label="Contraseña" value={password} type="password" onChange={(e) => setPassword(e.target.value)} showPasswordToggle={true} />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button className="cursor-pointer relative w-full inline-flex items-center justify-center p-3 font-medium rounded-md border border-transparent group bg-black/30 overflow-hidden" type="submit">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-md blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></span>
                <span className="relative z-10">Login</span>
              </button>
            </form>
            <p className="text-slate-300 text-center">
              ¿No tienes cuenta?&nbsp;
              <Link className="text-indigo-400 underline underline-offset-3" to="/register">Registrarse</Link>
            </p>
          </div>
        </div>
        <div className="hidden md:flex flex-1">
          <img className="object-cover w-full h-full" src={image} alt="Imagen Decorativa" />
        </div>
      </div>
    </div>
  )
}

export default Login