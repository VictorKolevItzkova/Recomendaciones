import jsonwebtoken from 'jsonwebtoken'
import "dotenv/config"
import Usuario from '../models/usuarioModel.js'

export function generarToken(email){
    return jsonwebtoken.sign({email},process.env.JWT_TOKEN_SECRET,{
        expiresIn:"15m"
    })
}

export function refrescarToken(email){
    return jsonwebtoken.sign({email},process.env.JWT_REFRESH_SECRET,{
        expiresIn:"7d"
    })
}

export async function verificarToken(req,res,next){
    //const token=req.header('Authorization')?.replace('Bearer ','')
    const token=req.cookies.refreshToken
    if(!token){
        return res.status(401).json({error:"Token requerido"})
    }
    /* VERIFICA TOKEN Y ALMACENA EL USUARIO LOGEADO */
    try{
        const dataToken=jsonwebtoken.verify(token,process.env.JWT_REFRESH_SECRET)
        const usuario= await Usuario.findOne({where:{email:dataToken.email}})
        req.userConectado=usuario;
        next();
    }catch(e){
        res.status(401).send(e)
    }
}