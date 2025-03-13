import { DataTypes } from "sequelize";
import dbClient from '../config/dbClient.js'

/* CREA TABLA genero */
const Genero=dbClient.define('genero',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})

export default Genero