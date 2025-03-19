import axios from 'axios';
import Actor from '../models/actorModel';

class actoresController{
    constructor(){

    }

    async getAll(req,res){
        try{
            const actores=Actor.findAll()
            res.status(200).json(actores)
        }catch(e){
            res.status(500).send(e)
        }
    }

    async getOne(req,res){
        try{
            const {id}=req.params
            const actor= await Actor.findByPk(id)

            if(!actor){
                return res.status(404).json({message:"Actor no encontrado"})
            }
            res.status(200).json(actor)
        }catch(e){
            res.status(500).send(e)
        }
    }
}

export default new actoresController()