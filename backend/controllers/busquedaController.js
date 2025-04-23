import { Op, Sequelize } from "sequelize"
import Usuario from "../models/usuarioModel.js";
import Pelicula from "../models/peliculaModel.js";
import Credito from "../models/creditoModel.js";
class busquedaController {
    constructor() {

    }

    async buscarEnBD(req, res) {
        const { query } = req.params

        try {
            const [usuarios, peliculas, creditos] = await Promise.all([
                buscarUsuarios(query),
                buscarPeliculas(query),
                buscarCreditos(query)
            ]);
            
            const usuariosMarcados = usuarios.map(u => ({ ...u.toJSON(), tipo: 'usuario' }))
            const peliculasMarcadas = peliculas.map(p => ({ ...p.toJSON(), tipo: 'pelicula' }))
            const creditosMarcado = creditos.map(c => ({ ...c.toJSON(), tipo: 'creditos' }))
        
            const combinados = [...peliculasMarcadas,...usuariosMarcados, ...creditosMarcado]
        
            res.status(200).json(combinados)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Error al Buscar" })
        }
    }

    async buscarEnUsuarios(req,res){
        const { query } = req.params

        try {
            const usuarios = await buscarUsuarios(query)

            const usuariosMarcados = usuarios.map(u => ({ ...u.toJSON(), tipo: 'usuario' }))

            res.status(200).json( usuariosMarcados )
        } catch (e) {
            res.status(500).json({ message: "Error al Buscar" })
        }
    }

    async buscarEnPeliculas(req,res){
        const { query } = req.params

        try {
            const peliculas = await buscarPeliculas(query)

            const peliculasMarcadas = peliculas.map(p => ({ ...p.toJSON(), tipo: 'pelicula' }))

            res.status(200).json( peliculasMarcadas )
        } catch (e) {
            res.status(500).json({ message: "Error al Buscar" })
        }
    }

    async buscarEnCreditos(req,res){
        const { query } = req.params

        try {
            const creditos = await buscarCreditos(query)

            const creditosMarcado = creditos.map(c => ({ ...c.toJSON(), tipo: 'creditos' }))

            res.status(200).json( creditosMarcado )
        } catch (e) {
            res.status(500).json({ message: "Error al Buscar" })
        }
    }
    
}

async function buscarUsuarios(query, limit = 3) {
    return await Usuario.findAll({
        where: {
            nombre: { [Op.like]: `%${query}%` }
        },
        order: [
            [Sequelize.literal(`
            CASE 
              WHEN nombre LIKE '${query}%' THEN 1
              WHEN nombre LIKE '%${query}%' THEN 2
              ELSE 3
            END
          `), 'ASC']
        ],
        limit
    });
}

async function buscarPeliculas(query, limit = 10) {
    return await Pelicula.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.like]: `%${query}%` } },
                { original_title: { [Op.like]: `%${query}%` } }
            ]
        },
        include:[
            {
                model:Credito,
                attributes:['id','nombre'],
                through:{
                    where:{
                        rol: 'Director'
                    }
                },
                require: false,
            }
        ],
        order: [
            [Sequelize.literal(`
            CASE 
              WHEN title LIKE '${query}%' THEN 1
              WHEN title LIKE '%${query}%' THEN 2
              WHEN original_title LIKE '${query}%' THEN 3
              WHEN original_title LIKE '%${query}%' THEN 4
              ELSE 5
            END
          `), 'ASC']
        ],
        limit
    });
}

async function buscarCreditos(query, limit = 3) {
    const creditos = await Credito.findAll({
        where: {
            nombre: { [Op.like]: `%${query}%` }
        },
        include:[
            {
                model:Pelicula,
                attributes:['id'],
                through:{
                    attributes: ['rol'],
                }
            }
        ],
        order: [
            [Sequelize.literal(`
            CASE 
              WHEN nombre LIKE '${query}%' THEN 1
              WHEN nombre LIKE '%${query}%' THEN 2
              ELSE 3
            END
          `), 'ASC']
        ],
        limit,
    });

    return creditos;

}

export default new busquedaController()

