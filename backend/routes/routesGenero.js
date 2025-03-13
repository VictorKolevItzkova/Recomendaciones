import generosController from '../controllers/generosController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()
/* RUTAS /generos*/
route.get('/insertar',verificarToken,generosController.create)

export default route