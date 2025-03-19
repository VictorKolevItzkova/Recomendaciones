import { DataTypes } from "sequelize";
import dbClient from '../config/dbClient.js'

/* CREA TABLA genero */
const Actor=dbClient.define('actor',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen:{
        type:DataTypes.STRING
    }
})

export default Actor