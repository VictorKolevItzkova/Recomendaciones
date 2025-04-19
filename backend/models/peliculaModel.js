import { DataTypes } from "sequelize";
import dbClient from '../config/dbClient.js'
import Vista from "./vistaModel.js";
import Genero from "./generoModel.js";
import Credito from "./creditoModel.js";
import PeliculaCredito from "./PeliculaCreditoModel.js";
import RecomendacionDiaria from "./recomendacionDiariaModel.js";
/* CREA TABLA pelicula */
const Pelicula = dbClient.define('pelicula', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    original_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    overview: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    release_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    poster_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    backdrop_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duracion:{
        type:DataTypes.INTEGER
    }
}, {
    timestamps: false
});

/* RELACIÓN 1:N */
Pelicula.hasMany(Vista,{foreignKey:'peliculaId'})
Vista.belongsTo(Pelicula,{foreignKey:'peliculaId'})

/*RELACIÓN N:N Y CREA TABLA INTERMEDIA PeliculaGenero */
Pelicula.belongsToMany(Genero,{through:"PeliculaGenero"})
Genero.belongsToMany(Pelicula,{through:"PeliculaGenero"})

/*RELACIÓN N:N Y CREA TABLA INTERMEDIA PeliculaCredito */
Pelicula.belongsToMany(Credito,{through:PeliculaCredito})
Credito.belongsToMany(Pelicula,{through:PeliculaCredito})

/* RELACIÓN 1:N */
Pelicula.hasMany(RecomendacionDiaria,{},{foreignKey:'peliculaId'})
RecomendacionDiaria.belongsTo(Pelicula,{foreignKey:'peliculaId'})


export default Pelicula