import { Request, Response } from "express";
import Product from "../models/product";


export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, category, stock, image } = req.body;
        const product = new Product({ name, description, price, category, stock, image });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, image } = req.body;
        const product = await Product.findByIdAndUpdate(id, { name, description, price, category, stock, image }, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const products = await Product.find({ category: id }).populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos por categoría" });
    }
};