const EsqueletoCreditosPeliculas = () => {
    return (
        <div className="bg-gray-900 text-white py-8 px-4">
            <div className="flex flex-col items-center">
                {/* Esqueleto de carga para la imagen */}
                <div className="w-40 h-40 bg-gray-700 rounded-full animate-pulse mb-6"></div>

                {/* Esqueleto de carga para el nombre */}
                <div className="w-48 h-8 bg-gray-700 animate-pulse mb-4"></div>

                {/* Esqueleto de carga para las películas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array(6).fill(0).map((_, index) => (
                        <div key={index} className="bg-gray-700 animate-pulse rounded-lg h-72"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EsqueletoCreditosPeliculas