import Usuario from '../models/usuarioModel.js'
import bcrypt from 'bcrypt'
import { generarToken, refrescarToken } from '../helpers/authentication.js'
class usuariosController{
    constructor(){}

    /* DEVUELVE TODOS */
    async getAll(req,res) {
        try{
            const usuarios=await Usuario.findAll()
            res.status(200).json(usuarios)
        }catch(e){
            res.status(500).send(e)
        }
    }

    /* DEVUELVE POR ID */
    async getOne(req,res){
        try{
            const {id}=req.params
            const usuario= await Usuario.findByPk(id)

            if(!usuario){
                return res.status(404).json({message:"Usuario no encontrado"})
            }
            res.status(200).json(usuario)
        }catch(e){
            res.status(500).send(e)
        }
    }

    /* ESTABLECER ADMIN */
    async setAdmin(req,res){
        try{
            const {id}=req.params
            const adminUser=await Usuario.findOne({where:{email:req.userConectado.email}})

            /* PERMITIDO SOLO USUARIOS CON ROL ADMIN */
            if (!adminUser || adminUser.rol !== 'admin') {
                return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
            }

            const usuario= await Usuario.findByPk(id)

            if(!usuario){
                return res.status(404).json({message:"Usuario no encontrado"})
            }
            await usuario.update({ rol: 'admin' });

            return res.json({ message: "El usuario ahora es administrador", usuario });
        }catch(e){
            res.status(500).send(e)
        }
    }

    /* REGISTRA USUARIO */
    async registro(req,res){
        try{
            const {nombre,email,password}=req.body
            const usuarioExiste= await Usuario.findOne({where:{email:email}}) //Encuentra el primer match
            if(usuarioExiste){
                return res.status(400).json({error:"El usuario ya existe"})
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

            const password_encriptado=await bcrypt.hash(password,3)
            const data=await Usuario.create({
                nombre:nombre,
                email:email,
                password:password_encriptado
            })

            res.status(201).json(data)
        }catch(e){
            res.status(500).send(e)
        }
    }

    /* VERIFICA EMAIL Y PASSWORD */
    async login(req,res){
        try{
            const {email,password}=req.body
            const usuarioExiste=await Usuario.findOne({where:{email:email}})

            if(!usuarioExiste){
                return res.status(400).json({error:"El usuario no existe"})
            }
            const passValid=await bcrypt.compare(password,usuarioExiste.password)

            if(!passValid){
                return res.status(400).json({error:"Password no válido"})
            }

            const accessToken=generarToken(email)
            const refreshToken=refrescarToken(email)
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.status(200).json(accessToken)
        }catch(e){
            res.status(500).send(e)
        }
    }

    async logout(req,res){
        try{
            res.clearCookie('refreshToken');
            res.json({message:'Logout exitoso'})
        }catch(e){
            res.status(500).send(e)
        }
    }

    async me(req,res){
        try{
            if(!req.userConectado){
                return res.status(401).json({message:'Acceso Denegado'})
            }
            const {id,nombre,email,rol} = req.userConectado

            res.json({id,nombre,email,rol})
        }catch(e){
            res.status(401).json({message:'Token invalido'})
        }   
    }

    async refreshToken(req,res){
        const refreshToken=req.cookies.refreshToken
        const email=req.userConectado.email
        if(!req.userConectado){
            return res.status(401).json({message:'Acceso Denegado'})
        }

        if(!refreshToken){
            return res.status(401).json({ message: 'No hay refresh token' });
        }

        try{
            const newAccessToken=generarToken(email)
            res.status(200).json({accessToken:newAccessToken})
        }catch(e){
            res.status(403).json({message:'Refresh Token Invalido'})
        }
    }
}

export default new usuariosController()