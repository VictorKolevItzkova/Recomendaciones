import axios from 'axios';
import Genero from '../models/generoModel.js';
import Usuario from '../models/usuarioModel.js';
class generosController{
    constructor(){

    }

    /* INSERTAR GENEROS A BD, RESTRINGIDO A ADMINS */
    async create(req,res){
        try{
            const adminUserEmail = req.userConectado;
            console.log(adminUserEmail)
            const adminUser = await Usuario.findOne({ where: { email: adminUserEmail.email } });
    
            if (!adminUser || adminUser.rol !== 'admin') {
                return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
            }

            console.log("Admin")
            /* DEVUELVE GENEROS */
            const response = await axios.get(
                `https://api.themoviedb.org/3/genre/movie/list?language=es`,
                {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                }
            );
            const generos=response.data.genres

            /* AGREGARLOS A BD SI NO EXISTEN */
            for (const genero of generos) {
                const existe = await Genero.findByPk(genero.id);
    
                if (!existe) {    
                    await Genero.create({
                        id: genero.id,
                        nombre:genero.name
                    });
                }
            }
            
            res.json({ message: "Generos insertados correctamente" });
        }catch(e){
            res.status(500).send(e)
        }
    }
}

export default new generosController()