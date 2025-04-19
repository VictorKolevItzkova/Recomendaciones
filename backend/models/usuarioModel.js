import { DataTypes } from "sequelize";
import dbClient from '../config/dbClient.js'
import Vista from "./vistaModel.js";
import { v4 as uuidv4 } from "uuid";
import RecomendacionDiaria from "./recomendacionDiariaModel.js";

/* CREA TABLA usuario*/
const Usuario = dbClient.define('usuario', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario'
    },
    pfp:{
        type:DataTypes.STRING,
        defaultValue: 'Default_pfp.png'
    }
})

/* RELACIÓN 1:N */
Usuario.hasMany(Vista,{foreignKey:'usuarioId'})
Vista.belongsTo(Usuario,{foreignKey:'usuarioId'})

/* RELACIÓN 1:N */
Usuario.hasMany(RecomendacionDiaria,{foreignKey:'usuarioId'})
RecomendacionDiaria.belongsTo(Usuario,{foreignKey:'usuarioId'})

export default Usuario