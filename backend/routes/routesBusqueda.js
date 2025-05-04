import busquedaController from '../controllers/busquedaController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()
/* RUTAS /search */
route.get('/all/:query',busquedaController.buscarEnBD)
route.get('/usuario/:query',busquedaController.buscarEnUsuarios)
route.get('/pelicula/:query',busquedaController.buscarEnPeliculas)
route.get('/credito/:query',busquedaController.buscarEnCreditos)


export default route