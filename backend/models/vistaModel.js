import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import dbClient from '../config/dbClient.js'

/* CREA TABLA vista (películas vistas)*/
const Vista=dbClient.define('vista',{
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4, 
        primaryKey: true,
        allowNull: false
    },
    usuarioId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    peliculaId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    calificacion:{
        type:DataTypes.FLOAT,
        defaultValue:0,
        validate:{
            min:0,
            max:5
        }
    },
    comentarios:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    fecha_vista:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
})

export default Vista