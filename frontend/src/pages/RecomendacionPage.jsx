import { useEffect, useState } from "react"
import api from "../api/axiosConfig"
import PeliculaDiaria from "../components/PeliculaDiaria"
import CarruselGenero from "../components/CarruselGenero"
const RecomendacionPage = () => {
  const [recomendacionDiaria, setRecomendacionDiaria] = useState(null)
  const [recomendacion, setRecomendacion] = useState({})

  useEffect(() => {
    const fetchRecomendacionDiaria = async () => {
      try {
        const response = await api.get('/peliculas/recomendacionDiaria')
        setRecomendacionDiaria(response.data)
      } catch (error) {
        console.error('Error fetching recomendacion:', error)
      }
    }

    fetchRecomendacionDiaria()
  }, [])

  useEffect(() => {
    const fetchRecomendacion = async () => {
      try {
        const response = await api.get('/peliculas/recomendacion')
        setRecomendacion(response.data)
      } catch (error) {
        console.error('Error fetching recomendacion:', error)
      }
    }

    fetchRecomendacion()
  }, [])
  return (
    <main>
      <section className="p-20">
        <h1 className="text-center text-6xl font-bold leading-tight mb-4">
          Recomendación <span className="text-pink-500">Diaria</span>
        </h1>
        <div className="p-10">
          {recomendacionDiaria && (
            <PeliculaDiaria
              id={recomendacionDiaria.id}
              titulo={recomendacionDiaria.title}
              imagen={`${recomendacionDiaria.backdrop_path}`}
              sinopsis={recomendacionDiaria.overview}
            />
          )}
        </div>
      </section>
      <section className="mb-10">
        {Object.entries(recomendacion).map(([genero, peliculas]) => (
          <CarruselGenero
            key={genero}
            genero={genero}
            peliculas={peliculas}
          />
        ))}
      </section>
    </main>
  )
}

export default RecomendacionPage