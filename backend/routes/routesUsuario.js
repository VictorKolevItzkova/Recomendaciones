import usuarioController from '../controllers/usuariosController.js'
import express from 'express'
import { verificarToken } from '../helpers/authentication.js'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const nombre = `${uuidv4()}${ext}`
        cb(null, nombre)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 } // 5 MB
})

const route = express.Router()
/* RUTAS /usuarios */
route.get('/', verificarToken, usuarioController.getAll)
route.post('/registrar', usuarioController.registro)
route.put('/', verificarToken, upload.single('pfp'), usuarioController.update)
route.post('/login', usuarioController.login)
route.post('/logout', usuarioController.logout)
route.post('/checkPassword', verificarToken, usuarioController.checkPassword)
route.post('/refresh', usuarioController.refreshToken)
route.get('/me', verificarToken, usuarioController.me)
route.put('/admin/:id', verificarToken, usuarioController.setAdmin)
route.delete('/', verificarToken, usuarioController.delete)

route.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.' })
    }
    next(err)
})

export default route