import { Response, Request } from "express";
import User from "../models/user";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, direction } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
         res.status(400).json({ error: "El correo electrónico ya está registrado" });
         return;
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);
            
        

        const user = new User({ name, email, password: hashedPassword , direction });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
             res.status(401).json({ message: 'Credenciales inválidas' });
             return;
        }
        const token = jwt.sign({ id: user._id, }, process.env.JWT_SECRET);
        res.json({mensaje: 'Login exitoso', token, });
       
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, password, direction } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword, direction }, { new: true });
        res.status(200).json(user);
        
    } catch (error) {    
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};

