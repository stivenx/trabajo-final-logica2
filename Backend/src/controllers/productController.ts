import { Request, Response } from "express";
import Product from "../models/product";
import Category from "../models/category";
import Type from "../models/type";


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
        
        try {
            const categoryExists = await Category.findById(category);
            if (!categoryExists ) {
                res.status(404).json({ error: "Categoría no encontrada" });
                return;
            }

        } catch (error) {
            res.status(500).json({ error: "Error al buscar la categoría" });
            return;
            
        }
        try {
            const typeExists = await Type.findById(type);
            if (!typeExists) {
                res.status(404).json({ error: "Tipo no encontrado" });
                return;
            }
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el tipo" });
            return;
            
        }
        
        const product = new Product({ name, description, price, category, stock, image, type });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
        return;
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, image, type } = req.body;

        try {
            const categoryExists = await Category.findById(category);
            if (!categoryExists ) {
                res.status(404).json({ error: "Categoría no encontrada" });
                return;
            }

        } catch (error) {
            res.status(500).json({ error: "Error al buscar la categoría" });
            return;
            
        }
        try {
            const typeExists = await Type.findById(type);
            if (!typeExists) {
                res.status(404).json({ error: "Tipo no encontrado" });
                return;
            }
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el tipo" });
            return;
            
        }

        const product = await Product.findByIdAndUpdate(id, { name, description, price, category, stock, image, type }, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
        return;
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