import { Request, Response } from "express";
import Product from "../models/product";
import Category from "../models/category";
import Type from "../models/type";
import mongoose from "mongoose";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().populate('category').populate('type');

        // Calcular el precio final con descuento, asegurando que discount no sea undefined
        const productsWithDiscount = products.map(product => ({
            ...product.toObject(),
            finalPrice: product.price - (product.price * ((product.discount ?? 0) / 100))
        }));

        res.status(200).json(productsWithDiscount);
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};


export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category').populate('type');

        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }

        const productWithDiscount = {
            ...product.toObject(),
            finalPrice: product.price - (product.price * (product.discount ?? 0 / 100))
        };

        res.status(200).json(productWithDiscount);
    } catch (error) {
        console.error("Error obteniendo el producto:", error);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
};




export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, category, stock, image, type, discount } = req.body;

        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).json({ message: "Categoría no válida" });
            return;
        }

        if (!type || !mongoose.Types.ObjectId.isValid(type)) {
            res.status(400).json({ message: "Tipo no válido" });
            return;
        }

        if (discount && (discount < 0 || discount > 100)) {
            res.status(400).json({ message: "El descuento debe estar entre 0 y 100" });
            return;
        }

        const product = new Product({ name, description, price, category, stock, image, type, discount: discount || 0 });
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
};



export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, image, type, discount } = req.body;

        // Verificar si el ID del producto es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "ID de producto no válido" });
            return;
        }

        // Validar el descuento (debe estar entre 0 y 100)
        if (discount !== undefined && (discount < 0 || discount > 100)) {
            res.status(400).json({ message: "El descuento debe estar entre 0 y 100" });
            return;
        }

        // Verificar si la categoría y el tipo existen
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).json({ message: "ID de categoría no válido" });
            return;
        }
        if (type && !mongoose.Types.ObjectId.isValid(type)) {
            res.status(400).json({ message: "ID de tipo no válido" });
            return;
        }

        // Buscar y actualizar el producto
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, category, stock, image, type, discount },
            { new: true } // Devuelve el producto actualizado
        );

        if (!updatedProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
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