const EsqueletoDetallePelicula = () => {
    return (
        <div className="flex flex-col w-full">
            {/* Backdrop skeleton */}
            <div className="relative w-full h-150">
                <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                <div className="absolute inset-0 rounded-b-xl bg-black/10 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
            </div>

            <div className="relative -mt-12 px-6 flex flex-col gap-4 z-10">
                <div className="flex items-start justify-between gap-6">
                    {/* Poster skeleton */}
                    <div className="flex-shrink-0 w-60 h-80 bg-gray-300 animate-pulse rounded-xl"></div>

                    {/* Info skeleton */}
                    <div className="flex-grow px-10 py-2">
                        <h1 className="text-4xl font-bold mb-3 bg-gray-300 animate-pulse w-3/4 h-6"></h1>
                        <div className="flex flex-wrap gap-4 text-md text-gray-600 mb-2">
                            <p className="bg-gray-300 animate-pulse w-32 h-6"></p>
                            <p className="flex gap-2">
                                <span className="bg-gray-300 animate-pulse w-40 h-6"></span>
                            </p>
                        </div>
                        <h2 className="text-xl font-semibold">Sinopsis:</h2>
                        <p className="text-lg bg-gray-300 animate-pulse w-3/4 h-6 mb-4"></p>

                        {/* Actions skeleton */}
                        <div className="flex justify-between text-center mt-12">
                            {/* Vista */}
                            <div className="flex-1">
                                <p className="font-semibold mb-2 bg-gray-300 animate-pulse w-24 h-6"></p>
                                <div className="w-12 h-12 bg-gray-300 animate-pulse mx-auto rounded-full"></div>
                            </div>

                            {/* Valoración */}
                            <div className="flex-1">
                                <p className="font-semibold mb-2 bg-gray-300 animate-pulse w-24 h-6"></p>
                                <div className="flex gap-1 justify-center">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="text-2xl bg-gray-300 animate-pulse w-8 h-8 rounded-full"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Review */}
                            <div className="flex-1">
                                <p className="font-semibold mb-1 bg-gray-300 animate-pulse w-24 h-6"></p>
                                <div className="bg-purple-600 text-white py-2 px-4 rounded-lg mt-1 cursor-not-allowed bg-opacity-30 animate-pulse w-32 h-10 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actor / Crew buttons skeleton */}
                <div className="flex justify-center gap-4 mt-10">
                    <button className="px-4 py-2 rounded-full font-semibold bg-gray-300 animate-pulse w-24 h-10"></button>
                    <button className="px-4 py-2 rounded-full font-semibold bg-gray-300 animate-pulse w-24 h-10"></button>
                </div>

                {/* Actors and crew skeleton */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-15">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-800 rounded-full px-4 py-2 shadow">
                            <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-full"></div>
                            <div>
                                <p className="bg-gray-300 animate-pulse w-24 h-6"></p>
                                <p className="bg-gray-300 animate-pulse w-20 h-4 mt-1"></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EsqueletoDetallePelicula