import { Request, Response } from "express";
import Product from "../models/product";


export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().populate('category') .populate('type');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category') .populate('type');
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, category, stock, image, type } = req.body;
        const product = new Product({ name, description, price, category, stock, image, type });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, image, type } = req.body;
        const product = await Product.findByIdAndUpdate(id, { name, description, price, category, stock, image, type }, { new: true });
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

export const getProductsByType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { Id } = req.params;
        const products = await Product.find({ Type: Id }).populate('type');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos por categoría y tipo" });
    }
};

export const getProductsByCategoryByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId, typeId } = req.params;
      const products = await Product.find({ category: categoryId, type: typeId }).populate('category').populate('type');
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los productos por categoría y tipo" });
    }
  }