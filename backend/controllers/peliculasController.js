import { cast, Op, Sequelize } from 'sequelize';
import axios from 'axios';
import Pelicula from "../models/peliculaModel.js";
import Usuario from "../models/usuarioModel.js";
import Vista from '../models/vistaModel.js';
import Genero from '../models/generoModel.js';
import Credito from '../models/creditoModel.js';
import RecomendacionDiaria from '../models/recomendacionDiariaModel.js';
class peliculasController {
    constructor() {

    }

    /* OBTENER TODOS */
    async getAll(req, res) {
        try {
            const peliculas = await Pelicula.findAll()
            res.status(200).json(peliculas)
        } catch (e) {
            res.status(500).send(e)
        }
    }
    /* OBTENER POR ID */
    async getOne(req, res) {
        try {
            const { id } = req.params
            const pelicula = await Pelicula.findByPk(id, {
                include: [
                    { model: Genero },
                    { model: Credito }
                ]
            })

            if (!pelicula) {
                return res.status(404).json({ message: "Pelicula no encontrado" })
            }
            res.status(200).json(pelicula)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async rellenarDirectores(req, res) {
        try {
            const adminUser = await Usuario.findOne({ where: { email: req.userConectado.email } });

            if (!adminUser || adminUser.rol !== 'admin') {
                return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
            }

            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            const obtenerCreditosTMDb = async (peliculaId) => {
                try {
                    const response = await axios.get(`https://api.themoviedb.org/3/movie/${peliculaId}/credits`,
                        {
                            headers: {
                                accept: 'application/json',
                                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                            }
                        });
                    return response.data;
                } catch (error) {
                    console.error(`Error obteniendo créditos para la película ${peliculaId}:`, error);
                    return null;
                }
            };

            const peliculas = await Pelicula.findAll({
                include: [
                    {
                        model: Credito,
                        through: { where: { rol: 'Director' } },
                        required: false
                    }
                ]
            })

            for (const pelicula of peliculas) {
                await delay(1000)
                // Si la película no tiene director (es decir, no está asociada a un Credito con job === 'Director')
                if (pelicula.creditos.length === 0) {
                    console.log(`Obteniendo créditos de la película: ${pelicula.title}`);

                    // Obtener los créditos de la película desde TMDb
                    const creditos = await obtenerCreditosTMDb(pelicula.id);

                    if (creditos && creditos.crew) {
                        // Buscar al director en los créditos
                        const director = creditos.crew.find(person => person.job === 'Director');

                        console.log(`Obteniendo créditos`);

                        if (director) {
                            let credito = await Credito.findOne({
                                where: { id: director.id }
                            });

                            if (!credito) {
                                // Si no se encuentra el crédito por id, lo creamos con los otros parámetros
                                credito = await Credito.create({
                                    id: director.id,
                                    nombre: director.name,
                                    imagen: director.profile_path ? `https://image.tmdb.org/t/p/original${director.profile_path}` : null
                                });
                            }
                            console.log(`créditos`);
                            // Relacionar la película con el director en la tabla intermedia PeliculaCreditos
                            await pelicula.addCredito(credito, { through: { rol: 'Director' } });


                            console.log(`Director para ${pelicula.title} actualizado: ${director.name}`);
                        } else {
                            console.log(`No se encontró director para ${pelicula.title}`);
                        }
                    }
                }
            }
            res.status(200).json({ message: "Directores rellenados correctamente" });
        } catch (e) {
            console.log(e)
            res.status(500).send('Error al rellenar directores');
        }
    }

    /* INSERTAR PELICULAS A BD, RESTRINGIDO A ADMINS */
    async create(req, res) {
        try {
            const adminUser = await Usuario.findOne({ where: { email: req.userConectado.email } });

            if (!adminUser || adminUser.rol !== 'admin') {
                return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
            }

            const {inicio,totalPages}=req.query

            console.log(inicio)
            console.log(totalPages)
            const endpoints = ['now_playing', 'popular', 'top_rated'];
            const peliculas = [];

            /* EVITA QUE BLOQUEEN LA API */
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            /* LISTA DE PELÍCULAS */
            const fetchData = async (endpoint, page) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${endpoint}?language=es-ES&page=${page}`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                );
                return response.data.results;
            };

            /* DETALLES DE PELÍCULAS */
            const fetchMovieDetails = async (movieId) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=es-ES`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                );
                const detalles = response.data;

                // Filtrar películas con revenue 0 o duración menor a 60 minutos
                if (detalles.runtime < 60) {
                    return null; // Retornar null si no cumple los criterios
                }

                return detalles;
            };

            const fetchCreditDetails = async (movieId) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                );
                return response.data.cast.filter(member => member.known_for_department === "Acting");
            }

            const fetchCrewDetails = async (movieId) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                );
                return response.data.crew
            }

            // Obtener películas de los diferentes endpoints
            for (const endpoint of endpoints) {
                for (let page = inicio; page <= totalPages; page++) {
                    const peliculasPorPagina = await fetchData(endpoint, page);
                    peliculas.push(...peliculasPorPagina);

                    if (page < totalPages) {
                        await delay(1000);
                    }
                }
            }

            // Insertar las películas en la base de datos
            for (const peli of peliculas) {
                console.log(1)
                const existe = await Pelicula.findByPk(peli.id);

                if (!existe) {
                    try {
                        await delay(300);
                        let movieDetails = await fetchMovieDetails(peli.id);
                        if (movieDetails) {
                            await delay(300);
                            let castDetails = await fetchCreditDetails(peli.id);
                            await delay(300);
                            let crewDetail = await fetchCrewDetails(peli.id)
                            await delay(500)
                            const nuevaPelicula = await Pelicula.create({
                                id: movieDetails.id,
                                original_title: movieDetails.original_title,
                                title: movieDetails.title,
                                overview: movieDetails.overview,
                                release_date: movieDetails.release_date,
                                poster_path: movieDetails.poster_path ? movieDetails.poster_path : null,
                                backdrop_path: movieDetails.backdrop_path ? movieDetails.backdrop_path : null,
                                duracion: movieDetails.runtime
                            });
                            if (movieDetails.genres) {
                                for (const genre of movieDetails.genres) {
                                    const genreRecord = await Genero.findOne({ where: { id: genre.id } });
                                    if (genreRecord) {
                                        await nuevaPelicula.addGenero(genreRecord); // Asocia Pelicula y Genero a tabla PeliculaGenero
                                    }
                                }
                            }
                            if (castDetails) {
                                for (const detalles of castDetails) {
                                    let actor = await Credito.findByPk(detalles.id)

                                    if (!actor) {
                                        actor = await Credito.create({
                                            id: detalles.id,
                                            nombre: detalles.original_name,
                                            imagen: detalles.profile_path ? detalles.profile_path : null
                                        })
                                    }
                                    await nuevaPelicula.addCredito(actor, { through: { rol: "Actor" } })
                                }
                            }
                            if (crewDetail) {
                                for (const detalles of crewDetail) {
                                    let crew = await Credito.findByPk(detalles.id)

                                    if (!crew) {
                                        crew = await Credito.create({
                                            id: detalles.id,
                                            nombre: detalles.original_name,
                                            imagen: detalles.profile_path ? detalles.profile_path : null
                                        })
                                    }
                                    await nuevaPelicula.addCredito(crew, { through: { rol: detalles.job } })
                                }
                            }
                            console.log(nuevaPelicula)
                        }
                    } catch (error) {
                        console.error(`Error al obtener datos de ${peli.title}:`, error.message);
                    }
                }
            }

            res.json({ message: "Películas insertadas correctamente" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar películas" });
        }
    }

    /* OBTENER GENEROS FAVORITOS */
    async obtenerGenerosFavoritos(userId) {
        try {

            /* RECOJE LOS DATOS DE Vista,Pelicula y Genero */
            const vistas = await Vista.findAll({
                where: { userId },
                include: [
                    {
                        model: Pelicula,
                        include: Genero
                    }
                ]
            });

            // Contabilizar la frecuencia de los géneros, ponderando por la calificación
            const generoFrecuencia = {};

            vistas.forEach(vista => {
                const calificacion = vista.calificacion || 0;  // Si no hay calificación, se considera 0
                vista.pelicula.generos.forEach(genero => {
                    if (!generoFrecuencia[genero.nombre]) {
                        generoFrecuencia[genero.nombre] = 0;
                    }
                    generoFrecuencia[genero.nombre] += calificacion;
                });
            });

            // Ordenar los géneros por la frecuencia total (favorito primero)
            const generosOrdenados = Object.entries(generoFrecuencia)
                .sort((a, b) => b[1] - a[1])
                .map(([genero, frecuencia]) => genero);

            return generosOrdenados;
            //res.status(200).json(generosOrdenados)
        } catch (e) {
            console.log(e)
        }
    }

    async obtenerRecomendaciones(req, res) {
        try {
            const usuarioId = req.userConectado.id
            // Obtener las películas vistas del usuario
            const vistas = await Vista.findAll({
                where: { usuarioId },
                include: [
                    {
                        model: Pelicula,
                        include: Genero
                    }
                ]
            });

            if (vistas.length == 0) {
                const peliculasAleatorias = await Pelicula.findAll({
                    order: Sequelize.literal('RAND()'), // Seleccionar aleatoriamente
                    limit: 45 // Obtener 45 películas aleatorias
                });

                // Dividir las películas en 3 filas de 15 películas cada una
                const filas = [];
                for (let i = 0; i < peliculasAleatorias.length; i += 15) {
                    filas.push(peliculasAleatorias.slice(i, i + 15));
                }

                return res.status(200).json({
                    "Califica Películas": filas[0] || [],
                    "Para Obtener": filas[1] || [],
                    "Recomendaciones Personalizadas": filas[2] || []
                });
            }

            const vistasConCalificacionAlta = vistas.filter(vista => vista.calificacion > 2.5);

            // Calcular la duración media de las películas vistas con calificación > 2.5
            const totalDuracion = vistasConCalificacionAlta.reduce((acc, vista) => acc + vista.pelicula.duracion, 0);
            const totalPeliculas = vistasConCalificacionAlta.length;
            const duracionMedia = totalPeliculas > 0 ? totalDuracion / totalPeliculas : 0;

            // Contabilizar la frecuencia de los géneros, ponderando por la calificación
            const generoFrecuencia = {};

            vistas.forEach(vista => {
                const calificacion = vista.calificacion || 0;  // Si no hay calificación, se considera 0
                vista.pelicula.generos.forEach(genero => {
                    if (!generoFrecuencia[genero.nombre]) {
                        generoFrecuencia[genero.nombre] = 0;
                    }
                    generoFrecuencia[genero.nombre] += calificacion;
                });
            });

            const peliculasVistasIds = vistas.map(v => v.peliculaId);


            // Ordenar los géneros por la frecuencia total (favorito primero)
            const generosFavoritos = Object.entries(generoFrecuencia)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3) // Limitar a los 3 géneros más frecuentes
                .map(([genero]) => genero);

            // Crear un objeto para almacenar las recomendaciones por género
            const recomendacionesPorGenero = {};

            for (const genero of generosFavoritos) {
                // Filtrar las películas que corresponden a este género y que no han sido vistas por el usuario
                const peliculasDelGenero = await Pelicula.findAll({
                    include: {
                        model: Genero,
                        where: {
                            nombre: genero  // Filtrar por el nombre del género
                        },
                        required: true
                    },
                    where: {
                        id: { [Op.notIn]: peliculasVistasIds },  // Excluir películas vistas
                        duracion: {
                            [Op.between]: [duracionMedia - 30, duracionMedia + 30]  // Filtrar por duración +- 30 minutos
                        }
                    },
                    limit: 15  // Limitar a 15 películas por género
                });

                // Guardar las recomendaciones para este género
                recomendacionesPorGenero[genero] = peliculasDelGenero;
            }

            res.status(200).json(recomendacionesPorGenero)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async obtenerRecomendacionDiaria(req, res) {
        try {
            const usuarioId = req.userConectado.id;
            const hoy = new Date().toISOString().split("T")[0];

            // Ver si ya existe una recomendación hoy
            const recomendacionExistente = await RecomendacionDiaria.findOne({
                where: { usuarioId, fecha: hoy },
                include: [Pelicula]
            });

            if (recomendacionExistente) {
                return res.status(200).json(recomendacionExistente.pelicula);
            }

            // Fecha hace 30 días
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);
            const fechaLimite = hace30Dias.toISOString().split('T')[0];

            // Obtener películas no vistas
            const vistas = await Vista.findAll({
                where: { usuarioId },
                attributes: ['peliculaId']
            });
            const peliculasVistasIds = vistas.map(v => v.peliculaId);
            // Películas recomendadas recientemente (últimos 30 días)
            const recomendacionesRecientes = await RecomendacionDiaria.findAll({
                where: {
                    usuarioId,
                    fecha: { [Op.gte]: fechaLimite }
                },
                attributes: ['peliculaId']
            });
            const peliculasRecientesIds = recomendacionesRecientes.map(r => r.peliculaId);

            const pelicula = await Pelicula.findOne({
                where: {
                    id: {
                        [Op.and]: [
                            { [Op.notIn]: peliculasVistasIds },
                            { [Op.notIn]: peliculasRecientesIds }
                        ]
                    },
                    backdrop_path: {
                        [Op.and]: [
                            { [Op.ne]: null },
                            { [Op.ne]: '' }
                        ]
                    }
                },
                order: Sequelize.literal('RAND()')
            });

            if (!pelicula) {
                return res.status(404).json({ message: "No hay películas nuevas para recomendar." });
            }

            // Guardar la recomendación diaria
            await RecomendacionDiaria.create({
                usuarioId,
                peliculaId: pelicula.id,
                fecha: hoy
            });

            res.status(200).json(pelicula);

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: "Error al obtener recomendación diaria" });
        }
    }

    async obtenerPeliculasDestacadas(req, res) {
        try {
            const ids = [27205, 155, 680, 550]

            const peliculas = await Pelicula.findAll({
                where: {
                    id: ids
                }
            });

            res.status(200).json(peliculas);
        } catch (e) {
            res.status(500).json({ error: 'Error al obtener las películas destacadas' });
        }
    }
}

export default new peliculasController()