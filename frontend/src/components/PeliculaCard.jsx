import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axiosConfig"
import imgDefault from "../assets/defaultCredito.jpg"
const PeliculaCard = ({ id, titulo, imagen }) => {
    const [hovered, setHovered] = useState(false)
    const [hoverValue, setHoverValue] = useState(0)
    const [calificacion, setCalificacion] = useState(0)
    const { usuario } = useContext(AuthContext)

    const handleMouseMove = (e, index) => {
        const { left, width } = e.currentTarget.getBoundingClientRect()
        const mouseX = e.clientX - left
        const value = mouseX < width / 2 ? index - 0.5 : index
        setHoverValue(value)
    }

    const handleClick = async (e, index) => {
        if (!usuario) return

        const { left, width } = e.currentTarget.getBoundingClientRect()
        const mouseX = e.clientX - left
        const value = mouseX < width / 2 ? index - 0.5 : index

        try {
            const response = await api.put('/historial/actualizar/calificacion', { peliculaId: id, calificacion: value })

            setCalificacion(value)
        } catch (error) {

        }
    }

    const mostrarEstrella = (i) => {
        const valor = hoverValue || calificacion
        if (valor >= i) return <FaStar className="text-yellow-400" />
        if (valor >= i - 0.5) return <FaStarHalf className="text-yellow-400" />
        return <FaRegStar className="text-gray-500" />
    }

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                if (!usuario) return
                const res = await api.get(`/historial/vista/${id}`);
                if (res.data.calificacion) {
                    setCalificacion(res.data.calificacion);
                } else {
                    setCalificacion(0);
                }
            } catch (error) {
                console.error("Error al cargar historial:", error);
            }
        };

        fetchHistorial()
    }, [id])

    return (
        <div className="relative w-64 bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false)
                setHoverValue(0)
            }}
            title={titulo}
        >
            <Link to={`/peliculas/${id}`}>
                <img
                    src={imagen ? `https://image.tmdb.org/t/p/w300/${imagen}` : imgDefault}
                    alt={titulo}
                    className="w-full h-64 object-cover"
                />
                <div className="p-4">
                    <h2 className="text-xl font-semibold break-words line-clamp-1">{titulo}</h2>
                </div>
            </Link>
            {hovered && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4 flex justify-center gap-1">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`text-2xl cursor-pointer ${!usuario ? "cursor-not-allowed opacity-70" : ""}`}
                                onMouseMove={(e) => handleMouseMove(e, i)}
                                onClick={(e) => handleClick(e, i)}
                            >
                                {mostrarEstrella(i)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    )
}

export default PeliculaCard