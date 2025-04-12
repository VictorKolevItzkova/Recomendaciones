import busquedaController from '../controllers/busquedaController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()
/* RUTAS /search */
route.get('/all/:query',verificarToken,busquedaController.buscarEnBD)
route.get('/usuario/:query',verificarToken,busquedaController.buscarEnUsuarios)
route.get('/pelicula/:query',verificarToken,busquedaController.buscarEnPeliculas)
route.get('/credito/:query',verificarToken,busquedaController.buscarEnCreditos)


export default route