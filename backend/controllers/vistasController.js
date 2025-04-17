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

    /* ACTUALIZAR VISTA */
    async update(req, res) {
        try {
            const { peliculaId, calificacion, comentarios, fecha_vista } = req.body
            const usuarioId = req.userConectado.id

            const vistaExiste = await Vista.findOne({ where: { usuarioId, peliculaId } })

            if (!vistaExiste) {
                return res.status(404).json({ message: "Pelicula no encontrada" })
            }

            const fechaVistaFinal = fecha_vista ? new Date(fecha_vista).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

            await vistaExiste.update({
                calificacion,
                comentarios,
                fecha_vista: fechaVistaFinal
            })

            res.status(201).json(vistaExiste)
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
            /* SI ESTA MARCADA DESMARCARLA */
            if (vistaExiste) {
                await vistaExiste.destroy();
                return res.status(200).json({ message: "Pelicula desmarcada como vista" })
            }

            const fechaVistaFinal = fecha_vista ? new Date(fecha_vista).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

            const nuevaVista = await Vista.create({
                usuarioId,
                peliculaId,
                calificacion,
                comentarios,
                fecha_vista: fechaVistaFinal
            });

            res.status(201).json(nuevaVista)
        } catch (e) {
            res.status(500).send(e)
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
                    { model: Usuario, attributes: ['id','nombre', 'pfp'] },
                    { model: Pelicula, attributes: ['id','title', 'poster_path','release_date'] },
                ],
                order: Sequelize.literal('RAND()'),
                limit: 6,
            });

            res.json(reviews);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener las reseñas' });
        }
    }
}

export default new vistasController()