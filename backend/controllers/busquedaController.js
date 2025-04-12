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
            const [usuarios, peliculas, cast] = await Promise.all([
                buscarUsuarios(query),
                buscarPeliculas(query),
                buscarCreditos(query)
            ]);
            
            const usuariosMarcados = usuarios.map(u => ({ ...u.toJSON(), tipo: 'usuario' }))
            const peliculasMarcadas = peliculas.map(p => ({ ...p.toJSON(), tipo: 'pelicula' }))
            const castMarcado = cast.map(c => ({ ...c.toJSON(), tipo: 'cast' }))
        
            const combinados = [...peliculasMarcadas,...usuariosMarcados, ...castMarcado]
        
            res.status(200).json(combinados)
        } catch (e) {
            res.status(500).json({ message: "Error al Buscar" })
        }
    }

    async buscarEnUsuarios(req,res){
        const { query } = req.params

        try {
            const usuarios = await buscarUsuarios(query)

            if (usuarios.length === 0) {
                return res.status(404).json({ message: "No se encontraron usuarios" });
            }

            res.status(200).json( usuarios )
        } catch (e) {
            res.status(500).json({ message: "Error al Buscar" })
        }
    }

    async buscarEnPeliculas(req,res){
        const { query } = req.params

        try {
            const peliculas = await buscarPeliculas(query)

            if (peliculas.length === 0) {
                return res.status(404).json({ message: "No se encontraron peliculas" });
            }

            res.status(200).json( peliculas )
        } catch (e) {
            res.status(500).json({ message: "Error al Buscar" })
        }
    }

    async buscarEnCreditos(req,res){
        const { query } = req.params

        try {
            const creditos = await buscarCreditos(query)

            if (creditos.length === 0) {
                return res.status(404).json({ message: "No se encontraron creditos" });
            }

            res.status(200).json( creditos )
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
    return await Credito.findAll({
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

export default new busquedaController()

