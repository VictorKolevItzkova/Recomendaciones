import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import dbClient from '../config/dbClient.js'

/* CREA TABLA vista (películas vistas)*/
const RecomendacionDiaria=dbClient.define('recomendacionDiaria',{
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
    fecha:{
        type:DataTypes.DATEONLY,
        defaultValue:DataTypes.NOW
    }
})

export default RecomendacionDiaria