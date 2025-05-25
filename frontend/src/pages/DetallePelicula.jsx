import { useContext, useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { FaEye, FaEyeSlash, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import DondeVer from "../components/DondeVer"
import imgDefault from "../assets/DefaultCredito.png"
import EsqueletoDetallePelicula from "../esqueletos/EsqueletoDetallePelicula";
import { Helmet } from "react-helmet";
const DetallePelicula = () => {
    const { id } = useParams()
    const { usuario,api } = useContext(AuthContext)

    const [pelicula, setPelicula] = useState(null)
    const [creditos, setCreditos] = useState(null)
    const [directores, setDirectores] = useState(null)
    const [actores, setActores] = useState(null)
    const [restoCreditos, setRestoCreditos] = useState(null)
    const [vista, setVista] = useState(false);
    const [hoverValue, setHoverValue] = useState(0);
    const [calificacion, setCalificacion] = useState(0);
    const [verCast, setVerCast] = useState(true);
    const [review, setReview] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(true);

    const dialogRef = useRef(null);

    const handleMouseMove = (e, index) => {
        const { left, width } = e.currentTarget.getBoundingClientRect()
        const mouseX = e.clientX - left
        const value = mouseX < width / 2 ? index - 0.5 : index
        setHoverValue(value)
    }

    const handleClick = async (e, index) => {
        if (!usuario) return

        const { left, width } = e.currentTarget.getBoundingClientRect()
        const mouseX = e.clientX - left
        const value = mouseX < width / 2 ? index - 0.5 : index

        try {
            const response = await api.put('/historial/actualizar/calificacion', {
                peliculaId: id,
                calificacion: value
            })

            setCalificacion(value)
            if (!vista) setVista(!vista);
        } catch (error) {
            console.error("Error al actualizar calificación:", error)
        }
    }

    const marcarVista = async () => {
        if (!usuario) return
        if (vista) {
            await api.delete('/historial/eliminar', {
                data: {
                    peliculaId: id
                }
            })
            setCalificacion(0);
            setHoverValue(0);
        } else {
            await api.post('/historial/marcarVista', {
                peliculaId: id
            })
        }
        setVista(!vista);
    };

    const mostrarEstrella = (i) => {
        const valor = hoverValue || calificacion;
        if (valor >= i) return <FaStar className="text-yellow-400" />;
        if (valor >= i - 0.5) return <FaStarHalfAlt className="text-yellow-400" />;
        return <FaRegStar className="text-gray-500" />;
    };

    const abrirModal = async () => {
        if (!usuario) return
        if (!dialogRef.current) return;

        try {
            const res = await api.get(`/historial/vista/${id}`);
            if (res.data.comentarios) {
                setReview(res.data.comentarios);
            } else {
                setReview("");
            }
        } catch (error) {
            console.error("Error al cargar review:", error);
        }

        dialogRef.current?.classList.remove("animate-fadeOut");
        dialogRef.current?.classList.add("animate-popIn");
        dialogRef.current?.showModal();
        setModalAbierto(true);
        setModalVisible(true);


    };

    const cerrarModal = () => {
        if (!dialogRef.current) return;
        dialogRef.current.classList.add("animate-fadeOut");
        setTimeout(() => {
            dialogRef.current?.close();
            dialogRef.current?.classList.remove("animate-popIn");
            dialogRef.current?.classList.remove("animate-fadeOut");
            setModalAbierto(false);
            setModalVisible(false);
        }, 150);

    };

    const guardarReview = async () => {
        try {
            if (!usuario) return
            const response = await api.put("/historial/actualizar/review", {
                comentarios: review,
                peliculaId: id,
            });

            if (response.status === 200 || response.status === 201) {
                cerrarModal();
                setReview("");
                setVista(true);
                Swal.fire({
                    icon: "success",
                    title: "¡Reseña guardada!",
                    text: "Tu review se ha guardado correctamente.",
                    confirmButtonColor: "#7e22ce",
                });
            } else {
                console.error("Error al guardar la reseña:", response.status);
            }
        } catch (error) {
            console.error("Error al enviar la reseña:", error);
        }
    };

    useEffect(() => {
        const inicio = Date.now();
        const delayMinimo = 500;

        const fetchData = async () => {
            try {
                const peliculaRes = await api.get(`/peliculas/select/${id}`);
                const data = peliculaRes.data;
                const creditos = data.creditos;

                setPelicula(data);
                setCreditos(creditos);
                setDirectores(creditos.filter(c => c.PeliculaCredito.rol === "Director"));
                setActores(creditos.filter(c => c.PeliculaCredito.rol === "Actor").slice(0, 32));
                setRestoCreditos(creditos.filter(c => c.PeliculaCredito.rol !== "Actor").slice(0, 32));

                if (!usuario) return
                const historialRes = await api.get(`/historial/vista/${id}`);

                setVista(historialRes.data.vista);
                setCalificacion(historialRes.data.calificacion || 0);
                setReview(historialRes.data.comentarios || "");
                setIsLoading(false)
            } catch (error) {
                if(error.response?.status===401 || error.response?.status===403){
                    setVista(false);
                    setCalificacion(0);
                    setReview("");
                }
                console.error("Error al cargar datos:", error);
            } finally {
                const tiempoTranscurrido = Date.now() - inicio;
                const tiempoRestante = delayMinimo - tiempoTranscurrido;

                setTimeout(() => setIsLoaded(false), Math.max(0, tiempoRestante));
                setIsLoading(true)
            }
        };

        setIsLoaded(true)
        fetchData();
    }, [id]);


    useEffect(() => {
        const dialog = dialogRef.current;

        const handleScrollLock = () => {

            if (modalAbierto) {
                document.body.classList.add("overflow-hidden");
            } else {
                document.body.classList.remove("overflow-hidden");
            }
        };

        const handleClickOutside = (e) => {
            if (dialog && modalAbierto) {
                const rect = dialog.getBoundingClientRect();
                const clickInside =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;

                if (!clickInside) {
                    cerrarModal();
                }
            }
        }

        handleScrollLock();
        window.addEventListener("click", handleClickOutside);

        return () => {
            document.body.classList.remove("overflow-hidden");
            window.removeEventListener("click", handleClickOutside);
        };
    }, [modalAbierto]);

    if (isLoading && isLoaded) return <EsqueletoDetallePelicula />;


    return (
        <>
            <Helmet>
                <title>Peliculas</title>
            </Helmet>
            <div className="relative w-full h-150">
                <img
                    src={`https://image.tmdb.org/t/p/original/${pelicula.backdrop_path}`}
                    alt="Backdrop"
                    className="w-full h-full object-cover rounded-b-xl"
                />
                <div className="absolute inset-0 rounded-b-xl bg-black/10 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
            </div>

            <div className="relative -mt-12 px-30 flex flex-col gap-4 z-10">
                <div className="flex items-start justify-between gap-6">
                    {/* Imagen */}
                    <div className="flex-shrink-0">
                        <img src={pelicula.poster_path ? `https://image.tmdb.org/t/p/w500/${pelicula.poster_path}`:imgDefault} alt={pelicula.title} className="rounded-xl w-60" />
                    </div>

                    {/* Info */}
                    <div className="flex-grow px-10 py-2">
                        <h1 className="text-4xl font-bold mb-3 capitalize">{pelicula.title}</h1>
                        <div className="flex flex-wrap gap-4 text-md text-gray-600 mb-2">
                            <p className="text-gray-500">{pelicula.release_date}</p>
                            <p>
                                Dirigida por{" "}
                                <span className="text-gray-500 underline underline-offset-2">
                                    {directores.map((director, index) => (
                                        <span key={director.id}>
                                            <Link to={`/creditos/${director.id}/peliculas/${director.PeliculaCredito.rol}`}>
                                                {director.nombre}
                                            </Link>
                                            {index < directores.length - 1 && ", "}
                                        </span>
                                    ))}
                                </span>
                            </p>
                        </div>
                        <h2 className="text-xl font-semibold">Sinopsis:</h2>
                        <p className="text-lg">{pelicula.overview}</p>
                        <div className="flex justify-between text-center mt-12">
                            {/* Vista */}
                            <div className="flex-1">
                                <p className="font-semibold mb-2">Vista</p>
                                <button onClick={marcarVista} className="text-3xl cursor-pointer" title="Marcar/Desmarcar Vista">
                                    {vista ? <FaEye className="text-purple-500" /> : <FaEyeSlash />}
                                </button>
                            </div>

                            {/* Valoración */}
                            <div className="flex-1">
                                <p className="font-semibold mb-2">Valoración</p>
                                <div className="flex gap-1 justify-center" title="Calificar">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className={`text-2xl cursor-pointer ${!usuario ? "cursor-not-allowed opacity-70" : ""}`}
                                            onMouseMove={(e) => usuario && handleMouseMove(e, i)}
                                            onClick={(e) => usuario && handleClick(e, i)}
                                        >
                                            {mostrarEstrella(i)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Review */}
                            <div className="flex-1">
                                <p className="font-semibold mb-1">Review</p>
                                <button
                                    onClick={abrirModal}
                                    className="bg-purple-600 text-white py-2 px-4 rounded-lg mt-1 cursor-pointer hover:bg-purple-700 transition duration-200 ease-in-out"
                                >
                                    Escribir review
                                </button>

                                <dialog
                                    ref={dialogRef}
                                    className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 w-full max-w-md border shadow-lg backdrop:bg-black/50 transition-all duration-200 ease-out
                                        ${modalVisible ? "animate-popIn" : ""}`}
                                >
                                    <h2 className="text-lg font-bold mb-4">Escribe tu reseña</h2>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded mb-4 resize-none"
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
                            </div>
                        </div>
                    </div>

                    {/* Dónde ver */}
                    <DondeVer peliculaId={id} titulo={pelicula.title} />
                </div>

                <div className="flex justify-center gap-4 mt-10">
                    <button
                        onClick={() => setVerCast(true)}
                        className={`px-4 py-2 rounded-full font-semibold ${verCast ? "bg-purple-600 text-white" : "bg-gray-300 text-black cursor-pointer"}`}
                    >
                        Cast
                    </button>
                    <button
                        onClick={() => setVerCast(false)}
                        className={`px-4 py-2 rounded-full font-semibold ${!verCast ? "bg-purple-600 text-white" : "bg-gray-300 text-black cursor-pointer"}`}
                    >
                        Crew
                    </button>
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-15">
                    {(verCast ? actores : restoCreditos).map((persona, index) => (
                        <Link to={`/creditos/${persona.id}/peliculas/${persona.PeliculaCredito.rol}`} key={persona.id}>
                            <div key={index} className="flex items-center gap-3 bg-gray-800 rounded-full px-4 py-2 shadow">
                                <img
                                    src={persona.imagen ? `https://image.tmdb.org/t/p/w300/${persona.imagen}` : imgDefault}
                                    alt={persona.nombre}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-white text-sm font-medium">{persona.nombre}</p>
                                    {!verCast && (
                                        <p className="text-gray-400 text-xs">{persona.PeliculaCredito.rol}</p>
                                    )}
                                </div>
                            </div>
                        </Link>

                    ))}
                </div>

            </div>
        </>

    )
}

export default DetallePelicula