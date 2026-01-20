import { Request, Response } from "express";
import Product from "../models/product";
import Category from "../models/category";
import Type from "../models/type";
import mongoose from "mongoose";
import Comentarios from "../models/comentarios";
import path from "path";
import fs from "fs";
import multer from "multer";

const routesimages = path.join(__dirname, "../../products");
if(!fs.existsSync(routesimages)){
    fs.mkdirSync(routesimages,{recursive: true});
    
}



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../products"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });


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
        console.log("Entrando a getProduct con URL:", req.originalUrl);
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
        const { name, description, price, category, stock, type, discount } = req.body;

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

       const images = req.files ? (req.files as Express.Multer.File[]).map(file => `products/${file.filename}`) : [];

        const product = new Product({ name, description, price, category, stock, images, type, discount: discount || 0 });
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
        let { name, description, price, category, stock, type, discount,imagenesConservar } = req.body;

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }

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

        if(!Array.isArray(imagenesConservar)){
            imagenesConservar = imagenesConservar ? [imagenesConservar] : [];
        }

        const imagenesConservaran = new Set(imagenesConservar || []);

        const eliminar = existingProduct.images.filter((image) => !imagenesConservaran.has(image));
        const guardar = existingProduct.images.filter((image) => imagenesConservaran.has(image));

        for(const img  of eliminar){
            const fullPath = path.join(__dirname, "../../", img);
            try {
                if(fs.existsSync(fullPath))
                    await fs.promises.unlink(fullPath);
            } catch (err) {
                const error = err as Error;
                console.warn(`No se pudo eliminar la imagen ${img}: ${error.message}`);
            }
        }

        if (req.files) {
            const newImages = (req.files as Express.Multer.File[]).map(file => `products/${file.filename}`);
            guardar.push(...newImages);
        }

        existingProduct.name = name || existingProduct.name;
        existingProduct.description = description || existingProduct.description;
        existingProduct.price = price || existingProduct.price;
        existingProduct.category = category || existingProduct.category;
        existingProduct.stock = stock || existingProduct.stock;
        existingProduct.type = type || existingProduct.type;
        existingProduct.discount = discount !== undefined ? discount : existingProduct.discount;
        existingProduct.images = guardar;

        await existingProduct.save();

        res.status(200).json();
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
};


export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const comentarios = await Comentarios.find({ product: id });
        for(const comentario of comentarios){
            if(comentario.images){
                for( const imagenes of comentario.images){
                    const fullPath = path.join(__dirname, "../../", imagenes);
                    try {
                        if(fs.existsSync(fullPath))
                            await fs.promises.unlink(fullPath);
                    } catch (err) {
                        const error = err as Error;
                        console.warn(`No se pudo eliminar la imagen ${imagenes}: ${error.message}`);
                    }
                }
            }
        }
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

  export const searchProductsLimit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ error: "El nombre del producto es requerido" });
        return;
      }
      const products = await Product.find({ name: { $regex: name, $options: "i" } }).populate('category',"name").populate('type',"name").limit(3);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Error al buscar los productos" });
    }
  };


export const getProductsByCategoryByType2 = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { typeId } = req.query;

    // Creamos el filtro base por categoría
    const filter: any = { category: categoryId };

    // Si vienen varios tipos (separados por coma)
    if (typeId) {
      const ids = (typeId as string).split(",").map((id) => id.trim());
      filter.type = { $in: ids }; // usamos $in para aceptar múltiples tipos
    }

    const products = await Product.find(filter)
      .populate("category")
      .populate("type");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos por categoría y tipos:", error);
    res.status(500).json({ error: "Error al obtener los productos por categoría y tipo" });
  }
};


