import express from 'express'
import bodyParser from 'body-parser'; 
import "dotenv/config"
import routesUsuario from "./routes/routesUsuario.js"
import routesPelis from './routes/routesPelis.js'
import routesVista from './routes/routesVista.js'
import routesGeneros from './routes/routesGenero.js';
import dbClient from "./config/dbClient.js"

const app=express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

/* RUTAS */
app.use("/usuarios",routesUsuario)
app.use("/peliculas",routesPelis)
app.use("/historial",routesVista)
app.use("/generos",routesGeneros)

/* SINCRONIZAR BD Y ESCUCHAR POR PUERTO*/
try{
    dbClient.sync()
    const PORT=process.env.PORT || 3000;
    app.listen(PORT,()=> console.log("Servidor activo en el puerto "+ PORT))
}catch(e){
    console.log(e)
}