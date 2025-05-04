import { Link } from "react-router-dom"
const PeliculaResultado = ({ item }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-[#161b22] rounded-2xl p-4 shadow-md">
            {/* Poster de la película */}
            <Link to={`/peliculas/${item.id}`}>
                <img
                    src={`${item.poster_path}`}
                    alt={item.title}
                    className="w-32 h-auto rounded-lg object-cover"
                />
            </Link>
            {/* Contenido principal */}
            <div className="flex flex-col flex-1 py-3">
                    {/* Título y año */}
                    <Link to={`/peliculas/${item.id}`}>
                        <h1 className="text-white text-2xl font-bold">
                            {item.title}{' '}
                            <span className="text-gray-400 font-normal">
                                {new Date(item.release_date).getFullYear()}
                            </span>
                        </h1>
                    </Link>

                {item.overview && (
                    <p className="my-3 break-words line-clamp-3 text-slate-200">{item.overview}</p>
                )}
                
                <div className="flex-grow" />
                
                <div className="mt-4">
                    <p className="text-gray-400 mb-2">Dirigido por</p>
                    <div className="flex flex-wrap gap-2">
                        {item.creditos.map((director) => (
                            <Link
                                to={`/creditos/${director.id}/peliculas/director`}
                                key={director.id}
                                className="bg-gray-700 text-slate-300 px-3 py-1 rounded-md hover:bg-gray-500 hover:text-white transition-colors duration-200"
                            >
                                {director.nombre}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PeliculaResultado