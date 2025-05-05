import vistaController from '../controllers/vistasController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()

/* RUTAS /historial */
route.get('/diario',verificarToken,vistaController.getDiario)
route.get('/reviews/destacadas',vistaController.getReviewsDestacadas)
route.get('/vista/:peliculaId',verificarToken,vistaController.verificarVista)
route.post('/marcarVista',verificarToken,vistaController.marcarVista)
route.put('/actualizar/calificacion',verificarToken,vistaController.actualizarCalificacion)
route.put('/actualizar/review',verificarToken,vistaController.actualizarReview)
route.delete('/eliminar',verificarToken,vistaController.desmarcarVista)


export default route