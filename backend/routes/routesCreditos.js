import creditosController from '../controllers/creditosController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()

/* RUTAS /creditos */
route.get('/:id/peliculas/:rol',creditosController.obtenerPeliculasPorRol)


export default route