import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from 'react-router-dom';
import image from '../assets/ai-generated-8848753_1280.jpg'
import { Eye, EyeClosed } from 'lucide-react'
import InputField from "../components/InputField";
const Register = () => {
  const { register } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [username, setUserName] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfPassword, setShowConfPassword] = useState(false)
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await register(email, password, confPassword, username)
      navigate('/')
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* NAVBAR arriba */}
      <nav className="w-full px-6 py-4 flex items-center justify-center md:justify-start bg-transparent">
        <Link to="/" className="md:ml-32 text-2xl font-bold text-white">MatchIT</Link>
      </nav>

      {/* CONTENIDO PRINCIPAL en dos columnas */}
      <div className="flex flex-1">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:px-16">
          <div className="w-full max-w-md px-4">
            <h1 className="text-3xl font-bold mb-3">Registrarse</h1>
            <p className="text-slate-300 mb-3">Por favor introduzca sus datos</p>
            <form className="space-y-4 mb-3" onSubmit={handleSubmit}>
              <InputField label="Nombre Usuario" value={username} type="text" onChange={(e) => setUserName(e.target.value)} />

              <InputField label="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
              
              <InputField label="Contraseña" value={password} type="password" onChange={(e) => setPassword(e.target.value)} showPasswordToggle={true} />

              <InputField label="Confirmar Contraseña" value={confPassword} type="password" onChange={(e) => setConfPassword(e.target.value)} showPasswordToggle={true}/>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button className="cursor-pointer relative w-full inline-flex items-center justify-center p-3 font-medium rounded-md border border-transparent group bg-black/30 overflow-hidden" type="submit">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-md blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></span>
                <span className="relative z-10">Registrarse</span>
              </button>
            </form>
            <p className="text-slate-300 text-center">
              ¿Ya tienes cuenta?&nbsp;
              <Link className="text-indigo-400 underline underline-offset-3" to="/login">Log In</Link>
            </p>
          </div>
        </div>
        <div className="hidden md:flex flex-1">
          <img src={image} alt="Imagen decorativa" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  )
}

export default Register