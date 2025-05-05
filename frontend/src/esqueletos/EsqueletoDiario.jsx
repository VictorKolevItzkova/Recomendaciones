const EsqueletoDiario = () => {
    return (
        <div className="p-6 w-full">
            <h2 className="text-2xl font-bold mb-6 bg-gray-300 w-1/3 h-8 animate-pulse rounded"></h2>

            <ul className="space-y-6">
                {[...Array(5)].map((_, index) => (
                    <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md text-white animate-pulse">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="bg-gray-300 h-6 w-48 rounded mb-2"></div>
                                <div className="bg-gray-300 h-4 w-32 rounded mb-1"></div>
                                <div className="bg-gray-300 h-4 w-64 rounded"></div>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-gray-300 h-6 w-6 rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between mt-8">
                <div className="bg-gray-300 w-24 h-10 rounded animate-pulse"></div>
                <div className="bg-gray-300 w-40 h-6 rounded animate-pulse"></div>
                <div className="bg-gray-300 w-24 h-10 rounded animate-pulse"></div>
            </div>
        </div>
    )
}

export default EsqueletoDiario