import { useNavigate } from "react-router-dom"


const LandingPage = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a Mi App</h1>
            <p className="mb-6 text-lg">Una app simple con navegación entre páginas</p>
            <button
                onClick={() => navigate('/login')}
                className="bg-white text-indigo-700 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
            >
                Iniciar sesión
            </button>
        </div>
    )
}

export default LandingPage