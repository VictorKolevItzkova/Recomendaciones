const EsqueletoPeliculaDiaria = () => {
    return (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-gray-300 animate-pulse">
            <div className="w-full h-[40rem] bg-gray-400"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="h-8 w-2/3 bg-gray-400 rounded mb-2"></div>
                <div className="h-6 w-1/2 bg-gray-400 rounded mb-4"></div>
            </div>
        </div>
    )
}

export default EsqueletoPeliculaDiaria