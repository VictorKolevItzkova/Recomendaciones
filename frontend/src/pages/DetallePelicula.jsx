import { useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axiosConfig"
const DetallePelicula = () => {
    const { id } = useParams()
    const [pelicula, setPelicula] = useState(null)

    useEffect(() => {
        const fetchPelicula = async () => {
            try {
                const response = await api.get(`/peliculas/select/${id}`)
                setPelicula(response.data)
            } catch (error) {
                console.error("Error fetching movie details:", error)
            }
        }

        fetchPelicula()
    }, [id])
    if (!pelicula) {
        return <div>Cargando...</div>
    }
    return (
        <div className="p-10 text-white">
            <h1 className="text-4xl font-bold mb-4">{pelicula.title}</h1>
            <img
                src={`${pelicula.poster_path}`}
                alt={pelicula.title}
                className="w-2 max-w-md mb-4 rounded-2xl"
            />
            <p className="text-lg">{pelicula.overview}</p>
            <p className="mt-2 text-gray-400">Fecha de estreno: {pelicula.release_date}</p>
        </div>
    )
}

export default DetallePelicula