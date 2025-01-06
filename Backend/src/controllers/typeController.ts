import { Request, Response } from "express";
import Type from "../models/type";

 export const  getType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const type = await Type.findById(id);
        res.status(200).json(type);
        return;
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el tipo" });
    }
};

export const getAllTypes = async (req: Request, res: Response) => {
    try {
        const types = await Type.find();
        res.status(200).json(types);
        return;
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los tipos" });
    }
};

export const createType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name,description } = req.body;
        const type = new Type({ name, description });
        await type.save();
        res.status(201).json(type);
        return;
        
    } catch (error) {
        res.status(500).json({ error: "Error al crear el tipo" });
    }
};

export const updateType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const type = await Type.findByIdAndUpdate(id, { name, description }, { new: true });
        res.status(200).json(type);
        return;        
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el tipo" });
    }    
};

export const deleteType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await Type.findByIdAndDelete(id);
        res.status(200).json({ message: "Tipo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el tipo" });
    }
};  
