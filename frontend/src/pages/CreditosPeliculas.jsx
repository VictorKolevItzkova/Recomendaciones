import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axiosConfig"
import PeliculaCard from "../components/PeliculaCard"

import imgDefault from "../assets/DefaultCredito.png"
const CreditosPeliculas = () => {
    const { id, rol } = useParams()
    const [peliculas, setPeliculas] = useState([])
    const [credito, setCredito] = useState(null)

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                const response = await api.get(`/creditos/${id}/peliculas/${rol}`)
                setCredito(response.data.credito)
                setPeliculas(response.data.peliculas)
            } catch (error) {
                console.error("Error al obtener las películas:", error)
            }
        }

        fetchPeliculas()
    }, [id, rol])

    if (!credito || !peliculas) {
        return <div>Cargando...</div>
    }
    return (
        <div className="bg-gray-900 text-white py-8 px-4">
            <div className="flex flex-col items-center">
                <img
                    src={credito.imagen ? credito.imagen : imgDefault}
                    alt={credito.nombre}
                    className="w-40 h-40 rounded-full object-cover mb-6"
                />
                <h1 className="text-3xl font-semibold mb-4">{credito.nombre}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {peliculas.map(pelicula => (
                        <PeliculaCard
                            key={pelicula.id}
                            id={pelicula.id}
                            titulo={pelicula.title}
                            imagen={pelicula.poster_path}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CreditosPeliculas