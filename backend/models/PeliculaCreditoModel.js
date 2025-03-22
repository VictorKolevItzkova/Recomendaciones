import { DataTypes } from "sequelize";
import dbClient from '../config/dbClient.js'

const PeliculaCredito = dbClient.define("PeliculaCredito", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    peliculaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "peliculas",
            key: "id"
        }
    },
    creditoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "creditos",
            key: "id"
        }
    },
    rol: { 
        type: DataTypes.STRING
    }
});

export default PeliculaCredito