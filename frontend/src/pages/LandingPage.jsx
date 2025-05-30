import { useNavigate, Link, useLocation } from "react-router-dom"
import herobg from "../assets/heroBg.png"
import herobgMv from "../assets/heroBgMv.png"
import { MailPlus, MailCheck } from "lucide-react"
import Reviews from "../components/Reviews"
import PeliculasDestacadas from "../components/PeliculasDestacadas"
import { Helmet } from "react-helmet";
import { useEffect } from "react"
import Swal from "sweetalert2"
const LandingPage = () => {
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        if (location.state?.cuentaRegistrada) {
            Swal.fire({
                icon: "success",
                title: "¡Cuenta registrada!",
                text: "Tu cuenta ha sido registrada correctamente.",
                confirmButtonColor: "#7e22ce",
            })

            // Limpiar el estado para evitar mostrar el mensaje al recargar
            window.history.replaceState({}, document.title)
        }
    }, [location.state])
    return (
        <>
            <Helmet>
                <title>MatchIt</title>
            </Helmet>
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
                                onClick={() => navigate("/login")}
                                className="cursor-pointer relative inline-flex items-center justify-center py-3 px-5 mt-4 font-medium rounded-md border border-transparent group bg-black/30 overflow-hidden"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-md blur-sm opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></span>
                                <span className="relative z-10">Get Started</span>
                            </button>
                        </div>
                    </div>
                </section>
                <PeliculasDestacadas />
                <Reviews />
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
                                className="w-full cursor-pointer bg-white py-4 rounded-full text-black font-bold hover:bg-blue-500 hover:text-white transition duration-300 flex items-center justify-center gap-2">
                                <MailPlus /> Regístrate
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full cursor-pointer bg-white py-4 rounded-full text-black font-bold hover:bg-blue-500 hover:text-white transition duration-300 flex items-center justify-center gap-2">
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
        </>
    )
}

export default LandingPage