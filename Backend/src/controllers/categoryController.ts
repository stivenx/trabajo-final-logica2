import { Response, Request } from "express";
import Category from "../models/category";


export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías" });
    }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la categoría" });
    }
}
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la categoría" });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la categoría" });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la categoría" });
    }
};
