import { useEffect, useState } from "react"
import api from "../api/axiosConfig"
import PeliculaDiaria from "../components/PeliculaDiaria"
import CarruselGenero from "../components/CarruselGenero"
import EsqueletoPeliculaDiaria from "../esqueletos/EsqueletoPeliculaDiaria";
import EsqueletoCarruselGenero from "../esqueletos/EsqueletoCarruselGenero";
const RecomendacionPage = () => {
  const [recomendacionDiaria, setRecomendacionDiaria] = useState(null)
  const [recomendacion, setRecomendacion] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const inicio = Date.now();
      const delayMinimo = 500;
  
      try {
        const [resDiaria, resGeneral] = await Promise.all([
          api.get('/peliculas/recomendacionDiaria'),
          api.get('/peliculas/recomendacion')
        ]);
  
        setRecomendacionDiaria(resDiaria.data);
        setRecomendacion(resGeneral.data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error al obtener recomendaciones:', error);
      } finally {
        const tiempoTranscurrido = Date.now() - inicio;
        const tiempoRestante = delayMinimo - tiempoTranscurrido;
  
        setTimeout(() => setIsLoaded(false), Math.max(0, tiempoRestante));
        setIsLoading(true)
      }
    };
  
    setIsLoaded(true)
    fetchData();
  }, []);

  if (isLoading && isLoaded) {
    return (
      <main>
        <section className="p-20">
          <div className="h-12 w-1/3 bg-gray-400 rounded mb-10 ml-130"></div>
          <EsqueletoPeliculaDiaria />
        </section>
        <section className="mb-10">
          <EsqueletoCarruselGenero />
        </section>
      </main>
    );
  }
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