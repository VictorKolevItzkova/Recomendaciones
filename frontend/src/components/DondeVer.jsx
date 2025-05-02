import { useEffect, useState } from "react";

function DondeVer({ peliculaId, titulo }) {
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${peliculaId}/watch/providers?api_key=${import.meta.env.VITE_API_TMDB_KEY}`
            );
            const data = await res.json();
            const proveedores = data.results?.ES?.flatrate || [];
            setProviders(proveedores.slice(0, 4));
        };

        fetchProviders();
    }, [peliculaId]);

    const slugify = (title) => {
        return title
            .toLowerCase()
            .normalize("NFD")                     // separa caracteres con tilde
            .replace(/[\u0300-\u036f]/g, "")     // elimina tildes
            .replace(/[^a-z0-9]+/g, "-")         // reemplaza todo lo que no sea alfanumérico por guiones
            .replace(/(^-|-$)+/g, "");           // elimina guiones al principio o final
    };

    const getJustWatchUrl = (title, country = "es") => {
        const slug = slugify(title);
        return `https://www.justwatch.com/${country}/pelicula/${slug}`;
    };

    return (
        <div className="flex-shrink-0">
            <div className="bg-gray-200 text-black w-60 flex flex-col gap-5 items-center justify-center rounded-lg p-4">
                <p className="mb-2 font-semibold">Dónde ver</p>
                {providers.length > 0 ? (
                    <ul className="flex flex-col items-center gap-5">
                        {providers.map((provider) => (
                            <li key={provider.provider_id} className="text-center font-semibold text-sm">
                                <a
                                    href={getJustWatchUrl(titulo)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                                        alt={provider.provider_name}
                                        className="mx-auto mb-1"
                                    />
                                    {provider.provider_name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600">No disponible</p>
                )}
            </div>
        </div>
    );
}

export default DondeVer;