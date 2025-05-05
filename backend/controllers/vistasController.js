import Vista from "../models/vistaModel.js";
import Usuario from "../models/usuarioModel.js";
import Pelicula from "../models/peliculaModel.js";
import { Op, Sequelize } from "sequelize";
class vistasController {
    constructor() {

    }

    async getAll(req, res) {
        try {
            const vistas = await Vista.findAll()
            res.status(200).json(vistas)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    /* MARCAR PELÍCULA COMO VISTA */
    async marcarVista(req, res) {
        try {
            const { peliculaId, calificacion, comentarios, fecha_vista } = req.body
            const usuarioId = req.userConectado.id

            const vistaExiste = await Vista.findOne({ where: { usuarioId, peliculaId } })

            if (vistaExiste) {
                return res.status(400).json({ message: "Ya está marcada como vista" });
            }

            const hayCalificacion = calificacion !== undefined && calificacion !== null;
            const hayComentario = comentarios && comentarios.trim() !== "";

            const fechaVistaFinal = fecha_vista
                ? new Date(fecha_vista).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

            const nuevaVista = await Vista.create({
                usuarioId,
                peliculaId,
                calificacion: hayCalificacion ? calificacion : null,
                comentarios: hayComentario ? comentarios : null,
                fecha_vista: fechaVistaFinal
            });

            res.status(201).json({ message: "Película marcada como vista", vista: nuevaVista })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async actualizarCalificacion(req, res) {
        try {
            const { peliculaId, calificacion } = req.body
            const usuarioId = req.userConectado.id

            const vista = await Vista.findOne({ where: { usuarioId, peliculaId } })

            if (!vista) {
                const fecha_vista = new Date().toISOString().split('T')[0];

                const nuevaVista = await Vista.create({
                    usuarioId,
                    peliculaId,
                    calificacion: calificacion,
                    comentarios: null,
                    fecha_vista: fecha_vista
                });

                return res.status(201).json({ message: "Película marcada como vista", vista: nuevaVista })
            }

            await vista.update({ calificacion })

            res.status(200).json({ message: "Calificación actualizada", vista })
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    }

    async actualizarReview(req, res) {
        try {
            const { peliculaId, comentarios } = req.body
            const usuarioId = req.userConectado.id

            const vista = await Vista.findOne({ where: { usuarioId, peliculaId } })

            if (!vista) {
                const fecha_vista = new Date().toISOString().split('T')[0];


                const nuevaVista = await Vista.create({
                    usuarioId,
                    peliculaId,
                    calificacion: null,
                    comentarios: comentarios,
                    fecha_vista: fecha_vista
                });

                return res.status(201).json({ message: "Película marcada como vista", vista: nuevaVista })
            }

            await vista.update({ comentarios })

            res.status(200).json({ message: "Comentario actualizado", vista })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async desmarcarVista(req, res) {
        try {
            const { peliculaId } = req.body;
            const usuarioId = req.userConectado.id;

            const vista = await Vista.findOne({ where: { usuarioId, peliculaId } });

            if (!vista) {
                return res.status(404).json({ message: "La película no está marcada como vista" });
            }

            await vista.destroy();

            res.status(200).json({ message: "Película desmarcada como vista, calificación y reseña eliminadas" });

        } catch (error) {
            res.status(500).json({ message: "Error al desmarcar película", error: error.message });
        }
    }

    async verificarVista(req, res) {
        try {
            const { peliculaId } = req.params
            const usuarioId = req.userConectado.id
            const vista = await Vista.findOne({
                where: { usuarioId, peliculaId }
            });

            res.status(200).json({ vista: !!vista, calificacion: vista ? vista.calificacion : 0, comentarios: vista ? vista.comentarios : null });
        } catch (e) {
            res.status(500).json({ e: 'Error al verificar vista' });
        }
    }

    async getReviewsDestacadas(req, res) {
        try {
            const reviews = await Vista.findAll({
                where: {
                    comentarios: {
                        [Op.ne]: null,
                    },
                },
                include: [
                    { model: Usuario, attributes: ['id', 'nombre', 'pfp'] },
                    { model: Pelicula, attributes: ['id', 'title', 'poster_path', 'release_date'] },
                ],
                order: Sequelize.literal('RAND()'),
                limit: 6,
            });

            res.status(200).json(reviews);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener las reseñas' });
        }
    }

    async getDiario(req, res) {
        try {
            const usuarioId = req.userConectado.id
            const { page = 1, limit = 10 } = req.query;

            const offset = (page - 1) * limit;

            const totalVistas = await Vista.count({
                where: { usuarioId: usuarioId },
            });

            const vistas = await Vista.findAll({
                where: { usuarioId: usuarioId },
                include: [{ model: Pelicula }],
                limit: parseInt(limit), // Limitar el número de registros por página
                offset: parseInt(offset), // Desplazamiento de la página
                order:[
                    ["fecha_vista", "DESC"]
                ]
            });

            const totalPages = Math.ceil(totalVistas / limit);
            res.status(200).json({
                vistas,
                totalPages, // Enviar el total de páginas junto con los datos
                currentPage: parseInt(page), // Enviar la página actual
                totalVistas, // Enviar el total de vistas
            });
        } catch (e) {
            res.status(500).json({ error: 'Error al obtener el historial' });
        }
    }
}

export default new vistasController()