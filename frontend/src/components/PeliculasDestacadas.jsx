import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import PeliculaCard from './PeliculaCard'
const PeliculasDestacadas = () => {
    const [peliculas, setPeliculas] = useState([])

    useEffect(() => {
        const fetchPeliculasDestacadas = async () => {
            try {
                const response = await api.get('/peliculas/destacadas')
                setPeliculas(response.data)
            } catch (error) {
                console.error("Error fetching movies:", error)
            }
        }

        fetchPeliculasDestacadas()
    }, [])

    return (
        <section className="p-20">
            <h1 className="text-4xl font-bold leading-tight mb-4">
                Películas Famosas
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {peliculas.map((pelicula) => (
                    <PeliculaCard
                        key={pelicula.id}
                        id={pelicula.id}
                        titulo={pelicula.title}
                        imagen={`${pelicula.poster_path}`}
                    />
                ))}
            </div>
        </section>
    )
}

export default PeliculasDestacadas