import vistaController from '../controllers/vistasController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()

/* RUTAS /historial */
route.get('/',verificarToken,vistaController.getAll)
route.put('/actualizar',verificarToken,vistaController.update)
route.post('/marcarVista',verificarToken,vistaController.marcarVista)

export default route