import { Link } from "react-router-dom"

const UsuarioResultado = ({ item }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-[#161b22] rounded-2xl p-4 shadow-md">
            {/* Usuario */}
            <Link>
                <div className="flex items-center gap-4 mb-1">
                    <img
                        src={`${import.meta.env.VITE_BASE_IMG_URL}${item.pfp}`}
                        alt={item.nombre}
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <h3 className="text-xl font-semibold text-white">{item.nombre}</h3>
                </div>
            </Link>
        </div>
    )
}

export default UsuarioResultado