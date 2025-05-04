import axios from 'axios';
import Credito from '../models/creditoModel.js';
import Pelicula from '../models/peliculaModel.js';

class creditosController{
    constructor(){

    }

    async getAll(req,res){
        try{
            const actores=Credito.findAll()
            res.status(200).json(actores)
        }catch(e){
            res.status(500).send(e)
        }
    }

    async getOne(req,res){
        try{
            const {id}=req.params
            const actor= await Credito.findByPk(id)

            if(!actor){
                return res.status(404).json({message:"Credito no encontrado"})
            }
            res.status(200).json(actor)
        }catch(e){
            res.status(500).send(e)
        }
    }

    async obtenerPeliculasPorRol(req, res) {
        try{
            const {id,rol}=req.params
            const credito= await Credito.findByPk(id,{
                include:[{
                    model:Pelicula,
                    through:{
                        where:{rol}
                    }
                }]
            })
            if(!credito){
                return res.status(404).json({message:"Credito no encontrado"})
            }
            res.status(200).json(credito.peliculas)
        }catch(e){
            res.status(500).send("Error al obtener películas por rol")
        }
    }
}

export default new creditosController()

// async getPeliculasPorRol(req, res) {
//     try {
//         const { id } = req.params; // ID del Credito
//         const { rol } = req.query; // rol pasado por query: ?rol=Director

//         if (!rol) {
//             return res.status(400).json({ message: "Debes especificar un rol (ej. Director, Actor)" });
//         }

//         const credito = await Credito.findByPk(id, {
//             include: [{
//                 model: Pelicula,
//                 through: {
//                     where: { rol }
//                 }
//             }]
//         });

//         if (!credito) {
//             return res.status(404).json({ message: "Crédito no encontrado" });
//         }

//         res.status(200).json(credito.peliculas);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al obtener películas por rol');
//     }
// }
