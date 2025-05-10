import PeliculaCard from './PeliculaCard'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
const CarruselGenero = ({ genero, peliculas }) => {
    const carruselRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    const handleScroll = (direction) => {
        if (carruselRef.current) {
            const scrollAmount = 800
            carruselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
        }
    }
    return (
        <div>
            <h1 className="text-6xl font-bold leading-tight mb-4 px-10 text-cyan-400">
                {genero}
            </h1>
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={`group absolute top-1/2 left-0 transform -translate-y-1/2 cursor-pointer z-10 h-[300px] flex items-center justify-center
                ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 bg-black/50 px-4 rounded-tr-[10px] rounded-br-[10px]`}
                    onClick={() => handleScroll('left')}
                >
                    <button className="cursor-pointer transition-transform duration-300 group-hover:scale-125">
                        <ChevronLeft />
                    </button>
                </div>
                <div className="p-10 flex gap-5 overflow-x-auto scrollbar-hide" ref={carruselRef}>
                    {peliculas.map((pelicula) => (
                        <div key={pelicula.id} className="min-w-[256px] flex-shrink-0">
                            <PeliculaCard
                                id={pelicula.id}
                                titulo={pelicula.title}
                                imagen={pelicula.poster_path}
                            />
                        </div>
                    ))}
                </div>
                <div className={`group absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer z-10 h-[300px] flex items-center justify-center
                ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 bg-black/50 px-4 rounded-tl-[10px] rounded-bl-[10px]`}
                    onClick={() => handleScroll('right')}>
                    <button className="cursor-pointer transition-transform duration-300 group-hover:scale-125">
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CarruselGenero