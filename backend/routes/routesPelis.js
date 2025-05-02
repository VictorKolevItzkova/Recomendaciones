import peliculasController from '../controllers/peliculasController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()

/* RUTAS /peliculas */
route.get('/',peliculasController.getAll)
route.get('/select/:id',peliculasController.getOne)
route.get('/insertar',verificarToken,peliculasController.create)
route.get('/rellenarDirectores',verificarToken,peliculasController.rellenarDirectores)
route.get('/recomendacion',verificarToken,peliculasController.obtenerRecomendaciones)
route.get('/recomendacionDiaria',verificarToken,peliculasController.obtenerRecomendacionDiaria)
route.get('/destacadas',peliculasController.obtenerPeliculasDestacadas)


export default route