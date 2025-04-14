import { useNavigate,Link } from "react-router-dom"
import herobg from "../assets/heroBg.png"
import herobgMv from "../assets/heroBgMv.png"
import { MailPlus,MailCheck } from "lucide-react"
const LandingPage = () => {
    const navigate = useNavigate()
    return (
        <main>
            <section className="relative h-screen flex flex-col md:flex-row items-center">
                <img className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-30 z-0" src={herobg} alt="Hero Imagen" />
                <img className="md:hidden w-80 h-80 border border-transparent rounded-full my-5" src={herobgMv} alt="Hero Imagen Movil" />
                <div className="md:relative z-20 max-w-4xl md:pl-20 mx-4">
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-4 text-center md:text-left">
                        Encuentra las <span className="text-cyan-400"> películas</span> que te hagan <span className="text-pink-500"> Match </span>
                    </h1>
                    <p className="text-lg text-gray-200 text-center md:text-left mb-4">
                        Recomendación de películas a partir de tus gustos y preferencias.
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <button
                            onClick={() => navigate("/explore")}
                            className="cursor-pointer relative inline-flex items-center justify-center py-3 px-5 mt-4 font-medium rounded-md border border-transparent group bg-black/30 overflow-hidden"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-md blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></span>
                            <span className="relative z-10">Get Started</span>
                        </button>
                    </div>
                </div>
            </section>
            <section className="p-20">
                <h1 className="text-4xl font-bold leading-tight mb-4">
                    Películas Famosas
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Card de película */}
                    {[
                        {
                            title: "Inception",
                            image: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg"
                        },
                        {
                            title: "The Dark Knight",
                            image: "https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg"
                        },
                        {
                            title: "Pulp Fiction",
                            image: "https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg"
                        },
                        {
                            title: "Fight Club",
                            image: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg"
                        },
                    ].map((pelicula, index) => (
                        <div key={index} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                            <img
                                src={pelicula.image}
                                alt={pelicula.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{pelicula.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="p-20">
                <h1 className="text-4xl font-bold leading-tight mb-4">
                    Reseñas
                </h1>
            </section>
            <section className="p-20 bg-black">
                <div className="w-1/2">
                    <h1 className="text-7xl font-bold leading-tight mb-4">
                        Únete Gratis
                    </h1>
                    <p className="text-2xl text-slate-300 text-center md:text-left mb-4">
                        Registrate para guardar las pelíclas que veas y recibir recomendaciones personalizadas.
                    </p>
                    <div className="my-15 flex items-center gap-10">
                        <button 
                            onClick={() => navigate("/register")}
                            className="w-full bg-white py-4 rounded-full text-black font-bold hover:bg-blue-500 hover:text-white transition duration-300 flex items-center justify-center gap-2">
                            <MailPlus /> Regístrate
                        </button>
                        <button 
                            onClick={() => navigate("/login")}
                            className="w-full bg-white py-4 rounded-full text-black font-bold hover:bg-blue-500 hover:text-white transition duration-300 flex items-center justify-center gap-2">
                            <MailCheck /> Sign In
                        </button>
                    </div>
                    <p className="text-2xl text-slate-300 text-center md:text-left mb-4">
                        ¿Ya eres miembro de MatchIT? 
                        <span> <Link className="font-bold text-white" to="/login">Sign in</Link></span>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default LandingPage