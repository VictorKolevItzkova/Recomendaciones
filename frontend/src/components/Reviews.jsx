import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Reviews = () => {
    const [reviews, setReviews] = useState([])

    const { api } = useContext(AuthContext)
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/historial/reviews/destacadas');
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section className="p-20">
            <h1 className="text-4xl font-bold leading-tight mb-4">
                Reseñas Destacadas
            </h1>
            <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col sm:flex-row gap-4 bg-[#161b22] rounded-2xl p-4 shadow-md"
                        >
                            {/* Poster de la película */}
                            <Link to={`/peliculas/${review.pelicula.id}`}>
                                <img
                                    src={`${review.pelicula.poster_path}`}
                                    alt={review.pelicula.title}
                                    className="w-32 h-auto rounded-lg object-cover"
                                />
                            </Link>


                            {/* Contenido principal */}
                            <div className="flex flex-col flex-1">
                                {/* Usuario */}
                                <Link>
                                    <div className="flex items-center gap-2 mb-1">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_IMG_URL}${review.usuario.pfp}`}
                                            alt={review.usuario.nombre}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <h3 className="text-lg font-semibold text-white">{review.usuario.nombre}</h3>
                                    </div>
                                </Link>

                                {/* Título y año */}
                                <Link to={`/peliculas/${review.pelicula.id}`}>
                                    <h1 className="text-white text-2xl font-bold">
                                        {review.pelicula.title}{' '}
                                        <span className="text-gray-400 font-normal">
                                            {new Date(review.pelicula.release_date).getFullYear()}
                                        </span>
                                    </h1>
                                </Link>


                                {/* Calificación */}
                                <div className="flex items-center gap-1 mt-2 text-yellow-400" title={`Calificación: ${review.calificacion}/5`}>
                                    {(() => {
                                        const rating = review.calificacion || 0;
                                        const fullStars = Math.floor(rating);
                                        const hasHalf = rating % 1 >= 0.5;
                                        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

                                        const stars = [];

                                        for (let i = 0; i < fullStars; i++) {
                                            stars.push(<FaStar key={`full-${i}`} />);
                                        }

                                        if (hasHalf) {
                                            stars.push(<FaStarHalfAlt key="half" />);
                                        }

                                        for (let i = 0; i < emptyStars; i++) {
                                            stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-500" />);
                                        }

                                        return stars;
                                    })()}
                                </div>

                                {/* Comentario */}
                                <p className="mt-3 text-lg text-gray-300">{review.comentarios}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Reviews