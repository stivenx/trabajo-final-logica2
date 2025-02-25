import { Request, Response } from "express";
import Product from "../models/product";
import Category from "../models/category";
import Type from "../models/type";
import mongoose from "mongoose";

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

        // Verifica si la categoría y el tipo están presentes
        if (!category) {
            res.status(400).json({ message: "La categoría es obligatoria" });
            return;
        }
        if (!type) {
            res.status(400).json({ message: "El tipo es obligatorio" });
            return;
        }

        // Verificar si los IDs son válidos antes de hacer la consulta en la base de datos
        if (!mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).json({ message: "El ID de la categoría no es válido" });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(type)) {
            res.status(400).json({ message: "El ID del tipo no es válido" });
            return;
        }

        try {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                res.status(404).json({ message: "Categoría no encontrada" });
                return;
            }
        } catch (error) {
            console.error("Error en la búsqueda de la categoría:", error);
            res.status(500).json({ message: "Error interno al buscar la categoría" });
            return;
        }

        try {
            const typeExists = await Type.findById(type);
            if (!typeExists) {
                res.status(404).json({ message: "Tipo no encontrado" });
                return;
            }
        } catch (error) {
            console.error("Error en la búsqueda del tipo:", error);
            res.status(500).json({ message: "Error interno al buscar el tipo" });
            return;
        }

        // Crear el producto
        const product = new Product({ name, description, price, category, stock, image, type });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Error en la creación del producto:", error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
};



export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, image, type } = req.body;

        if (!category) {
            res.status(400).json({ message: "La categoría es obligatoria" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).json({ message: "El ID de la categoría no es válido" });
            return;
        }

        try {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                res.status(404).json({ message: "Categoría no encontrada" });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: "Error al buscar la categoría" });
            return;
        }

        if (!type) {
            res.status(400).json({ message: "El tipo es obligatorio" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(type)) {
            res.status(400).json({ message: "El ID del tipo no es válido" });
            return;
        }

        try {
            const typeExists = await Type.findById(type);
            if (!typeExists) {
                res.status(404).json({ message: "Tipo no encontrado" });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: "Error al buscar el tipo" });
            return;
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { name, description, price, category, stock, image, type },
            { new: true }
        );
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto" });
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
        const products = await Product.find({ category: id }).populate('category').populate('type');
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


  export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ error: "El nombre del producto es requerido" });
        return;
      }
      const products = await Product.find({ name: { $regex: name, $options: "i" } }).populate('category',"name").populate('type',"name");
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Error al buscar los productos" });
    }
  };