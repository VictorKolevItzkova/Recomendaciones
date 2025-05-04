import { Link } from "react-router-dom"
import imgDefault from '../assets/DefaultCredito.png'

const CreditoResultado = ({ item }) => {
    const rolesUnicos = new Set();
    const rolesFiltrados = item.peliculas.reduce((acc, credito) => {
        const rol = credito.PeliculaCredito.rol;
        if (!rolesUnicos.has(rol)) {
            rolesUnicos.add(rol);  // Añadir el rol al Set para asegurar que sea único
            acc.push(rol);  // Añadir el rol a la lista
        }
        return acc;
    }, []);

    // Limitar a 3 roles
    const rolesLimitados = rolesFiltrados.slice(0, 3);

    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-[#161b22] rounded-2xl p-4 shadow-md">
            {/* Poster de la Credito */}
            <img
                src={item.imagen ? item.imagen : imgDefault}
                alt={item.nombre}
                className="w-24 h-auto rounded-lg object-cover"
            />
            {/* Contenido principal */}
            <div className="flex flex-col flex-1 py-3">
                {/* Título y año */}
                <h1 className="text-white text-2xl font-bold">
                    {item.nombre}{' '}
                </h1>

                <div className="mt-4">
                    <p className="text-gray-400 mb-2">Roles</p>
                    <div className="flex flex-wrap gap-2">
                        {rolesLimitados.map((rol, index) => (
                            <Link
                                to={`/creditos/${item.id}/peliculas/${rol}`}
                            >
                                <h3
                                    key={index}
                                    className="bg-gray-700 text-slate-300 px-3 py-1 rounded-md hover:bg-gray-500 hover:text-white transition-colors duration-200"
                                >
                                    {rol}
                                </h3>
                            </Link>

                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreditoResultado