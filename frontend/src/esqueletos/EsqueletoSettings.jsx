const EsqueletoSettings = () => {
    return (
        <div className="flex flex-col md:flex-row p-6 max-w-4xl mx-auto gap-8 animate-pulse">
            {/* Sección izquierda */}
            <div className="md:w-1/3 space-y-4">
                <div className="bg-gray-400 h-10 w-full rounded mb-4"></div>
                <div className="bg-gray-400 h-10 w-full rounded"></div>
            </div>

            {/* Sección derecha */}
            <div className="md:w-2/3">
                <div className="mb-4">
                    <div className="bg-gray-400 h-6 w-1/2 rounded mb-2"></div>
                    <div className="bg-gray-400 h-10 w-full rounded mb-4"></div>
                </div>

                <div className="mb-4">
                    <div className="bg-gray-400 h-6 w-1/2 rounded mb-2"></div>
                    <div className="bg-gray-400 h-10 w-full rounded mb-4"></div>
                </div>

                <div className="bg-gray-400 h-10 w-1/2 rounded"></div>
            </div>
        </div>
    );
}

export default EsqueletoSettings