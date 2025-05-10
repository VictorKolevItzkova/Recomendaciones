import { Link } from "react-router-dom"
const PeliculaDiaria = ({ id, titulo, imagen, sinopsis }) => {
    return (
        <Link to={`/peliculas/${id}`}>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" title={titulo}>
                <img
                    src={`https://image.tmdb.org/t/p/original/${imagen}`}
                    alt={titulo}
                    className="w-full h-[40rem] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h2 className="text-3xl font-bold text-white mb-2">{titulo}</h2>
                    <p className="text-white text-sm mb-4 line-clamp-3">{sinopsis}</p>
                </div>
            </div>
        </Link>

    )
}

export default PeliculaDiaria