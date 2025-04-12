import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'; 
import "dotenv/config"
import routesUsuario from "./routes/routesUsuario.js"
import routesPelis from './routes/routesPelis.js'
import routesVista from './routes/routesVista.js'
import routesGeneros from './routes/routesGenero.js';
import routesBusqueda from './routes/routesBusqueda.js';
import dbClient from "./config/dbClient.js"
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express()
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
app.use(cookieParser())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
/* RUTAS */
app.use("/api/usuarios",routesUsuario)
app.use("/api/peliculas",routesPelis)
app.use("/api/historial",routesVista)
app.use("/api/generos",routesGeneros)
app.use("/api/search",routesBusqueda)

/* SINCRONIZAR BD Y ESCUCHAR POR PUERTO*/
try{
    dbClient.sync()
    const PORT=process.env.PORT || 3000;
    app.listen(PORT,()=> console.log("Servidor activo en el puerto "+ PORT))
}catch(e){
    console.log(e)
}