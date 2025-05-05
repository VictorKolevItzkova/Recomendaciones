const EsqueletoCarruselGenero = () => {
    return (
        <div>
            <div className="h-8 w-32 bg-gray-400 rounded mb-4 px-10 animate-pulse"></div>
            <div className="relative">
                <div className="p-10 flex gap-5 overflow-x-auto scrollbar-hide">
                    {Array(7).fill().map((_, index) => (
                        <div key={index} className="min-w-[256px] h-[400px] bg-gray-400 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EsqueletoCarruselGenero