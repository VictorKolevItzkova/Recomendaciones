import usuarioController from '../controllers/usuariosController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'

const route=express.Router()
/* RUTAS /usuarios */
route.get('/',verificarToken,usuarioController.getAll)
route.post('/registrar',usuarioController.registro)
route.post('/login',usuarioController.login)
route.put('/admin/:id',verificarToken,usuarioController.setAdmin)


export default route