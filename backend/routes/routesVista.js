import vistaController from '../controllers/vistasController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()

/* RUTAS /historial */
route.get('/',verificarToken,vistaController.getAll)
route.get('/reviews/destacadas',vistaController.getReviewsDestacadas)
route.post('/marcarVista',verificarToken,vistaController.marcarVista)
route.put('/actualizar/calificacion',verificarToken,vistaController.actualizarCalificacion)
route.put('/actualizar/review',verificarToken,vistaController.actualizarReview)
route.delete('/eliminar',verificarToken,vistaController.desmarcarVista)


export default route