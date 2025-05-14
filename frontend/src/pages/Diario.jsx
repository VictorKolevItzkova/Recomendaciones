import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { NotebookPen, SquareChevronLeft, SquareChevronRight } from "lucide-react";
import { Helmet } from "react-helmet";
import api from "../api/axiosConfig";
import EsqueletoDiario from '../esqueletos/EsqueletoDiario'
import imgDefault from "../assets/DefaultCredito.png"

const Diario = () => {
    const [vistas, setVistas] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [hoverValues, setHoverValues] = useState({});
    const [calificaciones, setCalificaciones] = useState({});
    const [review, setReview] = useState("");
    const [selectedPeliculaId, setSelectedPeliculaId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(true);

    const dialogRef = useRef(null)

    const handleMouseMove = (e, index, peliculaId) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const value = mouseX < width / 2 ? index - 0.5 : index;
        setHoverValues((prev) => ({ ...prev, [peliculaId]: value }));
    };

    const handleMouseLeave = (peliculaId) => {
        setHoverValues((prev) => ({ ...prev, [peliculaId]: 0 }));
    };

    const handleClick = async (e, index, peliculaId) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const value = mouseX < width / 2 ? index - 0.5 : index;

        try {
            await api.put("/historial/actualizar/calificacion", {
                peliculaId,
                calificacion: value,
            });

            setCalificaciones((prev) => ({ ...prev, [peliculaId]: value }));
            setHoverValues((prev) => ({ ...prev, [peliculaId]: 0 }));
        } catch (error) {
            console.error("Error al actualizar calificación:", error);
        }
    };

    const renderEstrellasInteractivas = (valor, peliculaId) => {
        const actual = hoverValues[peliculaId] || calificaciones[peliculaId] || valor;

        return [...Array(5)].map((_, i) => {
            const index = i + 1;
            const icon =
                actual >= index ? (
                    <FaStar className="text-yellow-400" />
                ) : actual >= index - 0.5 ? (
                    <FaStarHalfAlt className="text-yellow-400" />
                ) : (
                    <FaRegStar className="text-gray-500" />
                );

            return (
                <div
                    key={i}
                    className="cursor-pointer text-lg"
                    title="Calificar"
                    onMouseMove={(e) => handleMouseMove(e, index, peliculaId)}
                    onMouseLeave={() => handleMouseLeave(peliculaId)}
                    onClick={(e) => handleClick(e, index, peliculaId)}
                >
                    {icon}
                </div>
            );
        });
    };

    const desmarcarVista = async (peliculaId) => {
        try {
            await api.delete("/historial/eliminar", {
                data: { peliculaId }
            });
            // Eliminar de la lista localmente
            const actualizadas = vistas.filter(v => v.peliculaId !== peliculaId);
            setVistas(actualizadas);
        } catch (error) {
            console.error("Error al desmarcar película:", error);
        }
    };

    const abrirModal = (peliculaId, textoReview) => {
        setReview(textoReview || "");
        setSelectedPeliculaId(peliculaId);
        setModalVisible(true);
        setTimeout(() => dialogRef.current?.showModal(), 0);
    };

    const cerrarModal = () => {
        dialogRef.current?.close();
        setModalVisible(false);
        setReview("");
        setSelectedPeliculaId(null);
    };

    const guardarReview = async () => {
        try {
            await api.put("/historial/actualizar/review", {
                peliculaId: selectedPeliculaId,
                comentarios:review,
            });

            setVistas((prev) =>
                prev.map((v) =>
                    v.peliculaId === selectedPeliculaId
                        ? { ...v, comentarios:review }
                        : v
                )
            );

            cerrarModal();
        } catch (err) {
            console.error("Error al guardar la reseña:", err);
        }
    };

    useEffect(() => {
        const delayMinimo = 500;
        const inicio = Date.now();

        const cargar = async () => {
            try {
                const res = await api.get("/historial/diario", {
                    params: { page: currentPage, limit: 10 },
                });
                setVistas(res.data.vistas);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage);
                setIsLoading(false)
            } catch (err) {
                console.error("Error al cargar el diario:", err);
            } finally {
                const tiempoTranscurrido = Date.now() - inicio;
                const tiempoRestante = delayMinimo - tiempoTranscurrido;
                setTimeout(() => setIsLoaded(false), Math.max(0, tiempoRestante));
                setIsLoading(true)
            }
        };

        setIsLoaded(true);
        cargar();
    }, [currentPage]);

    const cambiarPagina = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading && isLoaded) {
        return <EsqueletoDiario />
    }
    return (
        <>
            <Helmet>
                <title>Diario</title>
            </Helmet>
            <div className="bg-[#121212] min-h-screen text-white p-10">
                <h1 className="text-3xl font-bold mb-6">Diario</h1>
                <div className="overflow-x-auto px-15">
                    <table className="w-full table-fixed border-separate border-spacing-y-3">
                        <thead className="text-gray-400 text-sm uppercase text-left">
                            <tr>
                                <th className="w-20">Month</th>
                                <th className="w-16">Day</th>
                                <th className="min-w-[200px]">Film</th>
                                <th className="w-16">Year</th>
                                <th className="w-32 text-center">Rating</th>
                                <th className="w-20 text-center">Review</th>
                                <th className="w-20 text-center">Viewed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vistas.map((v) => {
                                const fecha = new Date(v.fecha_vista);
                                const mes = fecha.toLocaleString("default", { month: "short" }).toUpperCase();
                                const dia = fecha.getDate();
                                return (
                                    <tr
                                        key={v.peliculaId}
                                        className="bg-[#1a1a1a] hover:bg-[#222] rounded-lg"
                                    >
                                        <td className="px-2 py-4 font-semibold text-blue-400">{mes}</td>
                                        <td className="px-2 font-bold text-lg">{dia}</td>
                                        <td >
                                            <Link to={`/peliculas/${v.peliculaId}`} title={v.pelicula.title} className="flex items-center gap-4 px-2 py-2">
                                                <img
                                                    src={v.pelicula.poster_path ? `https://image.tmdb.org/t/p/w300/${v.pelicula.poster_path}` : imgDefault}
                                                    alt={v.titulo}
                                                    className="w-12 h-16 object-cover rounded"
                                                />
                                                <span className="text-white font-semibold text-2xl">{v.pelicula.title}</span>
                                            </Link>
                                        </td>

                                        <td className="text-gray-400">{new Date(v.pelicula.release_date).getFullYear()}</td>
                                        <td>
                                            <div className="flex justify-center items-center gap-1 h-full">
                                                {renderEstrellasInteractivas(v.calificacion, v.peliculaId)}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => abrirModal(v.peliculaId, v.comentarios)}
                                                title="Escribir review"
                                                className="text-xl cursor-pointer"
                                            >
                                                <NotebookPen />
                                            </button>
                                        </td>
                                        <td className="text-center">
                                            <button onClick={() => desmarcarVista(v.peliculaId)} className="text-2xl cursor-pointer" title="Desmarcar como vista">
                                                <FaEye className="text-purple-500" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <dialog
                        ref={dialogRef}
                        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 w-full max-w-md border shadow-lg backdrop:bg-black/50 transition-all duration-200 ease-out
                    ${modalVisible ? "animate-popIn" : ""}`}
                    >
                        <h2 className="text-lg font-bold mb-4">Escribe tu reseña</h2>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded mb-4 resize-none text-black"
                            rows="5"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Escribe tu reseña aquí..."
                        ></textarea>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={cerrarModal}
                                className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarReview}
                                className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Guardar
                            </button>
                        </div>
                    </dialog>
                    <div className="flex justify-center items-center gap-6 mt-8 text-xl">
                        <button
                            onClick={() => cambiarPagina(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`transition-colors ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-cyan-400 hover:text-cyan-300"
                                }`}
                            title="Anterior"
                        >
                            <SquareChevronLeft />
                        </button>
                        <span className="text-white font-medium">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => cambiarPagina(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`transition-colors ${currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-purple-400 hover:text-purple-300"
                                }`}
                            title="Siguiente"
                        >
                            <SquareChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Diario;
