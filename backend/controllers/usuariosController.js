import Usuario from '../models/usuarioModel.js'
import bcrypt from 'bcrypt'
import { generarToken, refrescarToken } from '../helpers/authentication.js'
import fs from 'fs'
import { dirname } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'
import jsonwebtoken from 'jsonwebtoken'

class usuariosController {
    constructor() { }

    /* DEVUELVE TODOS */
    async getAll(req, res) {
        try {
            const usuarios = await Usuario.findAll()
            res.status(200).json(usuarios)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    /* DEVUELVE POR ID */
    async getOne(req, res) {
        try {
            const { id } = req.params
            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }
            res.status(200).json(usuario)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    /* ESTABLECER ADMIN */
    async setAdmin(req, res) {
        try {
            const { id } = req.params
            const adminUser = await Usuario.findOne({ where: { email: req.userConectado.email } })

            /* PERMITIDO SOLO USUARIOS CON ROL ADMIN */
            if (!adminUser || adminUser.rol !== 'admin') {
                return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
            }

            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }
            await usuario.update({ rol: 'admin' });

            return res.json({ message: "El usuario ahora es administrador", usuario });
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async update(req, res) {
        try {

            const { nombre: nombreNuevo, newPassword } = req.body

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);

            const usuarioExiste = await Usuario.findOne({ where: { email: req.userConectado.email } })

            if (!usuarioExiste) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            let rutaImagen = usuarioExiste.pfp || 'Default_pfp.png'

            if (req.file) {
                try {
                    const oldImagePath = path.join(__dirname, '..', 'uploads', 'images', path.basename(usuarioExiste.pfp));

                    if (usuarioExiste.pfp && usuarioExiste.pfp !== 'Default_pfp.png' && fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }

                    rutaImagen = `${req.file.filename}`;
                } catch (e) {
                    return res.status(403).json({ message: "Error al eliminar la imagen anterior" });
                }
            }

            const datosActualizados = {
                nombre: nombreNuevo,
                pfp: rutaImagen
            }

            if (newPassword) {
                datosActualizados.password = await bcrypt.hash(newPassword, 3)
            }

            await usuarioExiste.update(datosActualizados)
            const { id, nombre, email, rol, pfp } = usuarioExiste
            res.status(202).json({ id, nombre, email, rol, pfp })
        } catch (e) {
            res.status(500).json({ message: "Error al actualizar el usuario" })
        }
    }

    /* REGISTRA USUARIO */
    async registro(req, res) {
        try {
            const { email, nombre, password, confPassword } = req.body
            const usuarioExiste = await Usuario.findOne({ where: { email: email } }) //Encuentra el primer match
            if (usuarioExiste) {
                return res.status(400).json({ error: "El usuario ya existe" })
            }

            /*
                CONTRASEÑA SEGURA
            */

            // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,100}$/;
            // if (!passwordRegex.test(password)) {
            //     return res.status(400).json({
            //         error: "La contraseña debe tener entre 6 y 100 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial, y no puede contener espacios."
            //     });
            // }

            if (password != confPassword) {
                return res.status(400).json({ error: "Las contraseñas deben ser iguales" })
            }

            const password_encriptado = await bcrypt.hash(password, 3)

            const imagenDefecto = 'Default_pfp.png'
            const data = await Usuario.create({
                nombre: nombre,
                email: email,
                password: password_encriptado,
                pfp: imagenDefecto
            })

            res.status(201).json(data)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    /* VERIFICA EMAIL Y PASSWORD */
    async login(req, res) {
        try {
            const { email, password } = req.body
            const usuarioExiste = await Usuario.findOne({ where: { email: email } })

            if (!usuarioExiste) {
                return res.status(400).json({ error: "El usuario no existe" })
            }
            const passValid = await bcrypt.compare(password, usuarioExiste.password)

            if (!passValid) {
                return res.status(400).json({ error: "Password no válido" })
            }

            const accessToken = generarToken(email)
            const refreshToken = refrescarToken(email)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.status(200).json(accessToken)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async checkPassword(req, res) {
        try {
            const { password } = req.body
            const usuarioExiste = await Usuario.findOne({ where: { email: req.userConectado.email } })

            if (!usuarioExiste) {
                return res.status(400).json({ estado: false })
            }
            const passValid = await bcrypt.compare(password, usuarioExiste.password)

            if (!passValid) {
                return res.status(200).json({ estado: false })
            }

            res.status(200).json({ estado: true })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('refreshToken');
            res.json({ message: 'Logout exitoso' })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async me(req, res) {
        try {
            if (!req.userConectado) {
                return res.status(401).json({ message: 'Acceso Denegado' })
            }
            const { id, nombre, email, rol, pfp } = req.userConectado

            res.json({ id, nombre, email, rol, pfp })
        } catch (e) {
            res.status(401).json({ message: 'Token invalido' })
        }
    }

    async refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: 'No hay refresh token' });
        }
    
        try {
            const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const newAccessToken = generarToken(decoded.email);
            res.status(200).json({ accessToken: newAccessToken });
        } catch (e) {
            if (e.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Refresh Token Inválido' });
            }
            if (e.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Refresh Token Expirado' });
            }
            return res.status(500).json({ message: 'Error al verificar el refresh token', error: e.message });
        }
    }
}

export default new usuariosController()