import e, { Request, Response } from "express";
import Comentarios from "../models/comentarios";
import product from "../models/product";
import multer from "multer";
import path from "path";
import fs from "fs";


const routesimages = path.join(__dirname, "../../comentarios");
if(!fs.existsSync(routesimages)){
    fs.mkdirSync(routesimages ,{recursive: true});
    
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,routesimages);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

export const upload = multer({ storage: storage });


export const createcomentario = async(req: Request, res: Response) =>{
 const {product, email, comentario, rating} = req.body

 try {
    
    const images = (req.files as Express.Multer.File[]).map((file)=> `comentarios/${file.filename}`);
    const newcomment = new Comentarios({product, email, comentario, rating, images});
    await newcomment.save();
    res.status(200).json(newcomment);

 } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ message: "Error al crear el comentario" });
 }


}


export const getcomentarios = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const comentaries = await Comentarios.find({product: id}).sort({fechcreation: -1}).populate('email');
        res.status(200).json(comentaries);
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        res.status(500).json({ message: "Error al obtener los comentarios" });
    }
};


export const deletecomentario = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const comentaries = await Comentarios.findById(id);
        if (!comentaries) {
          res.status(404).json({ message: "Comentario no encontrado" });
          return;
        }
        for(const image of comentaries.images){
            const fullPath = path.join(__dirname, "../../", image);
            try {
              if(fs.existsSync(fullPath))
                await fs.promises.unlink(fullPath);
            } catch (err) {
                const error = err as Error;
                console.warn(`No se pudo eliminar la imagen ${image}: ${error.message}`);
            }
        }
        await Comentarios.findByIdAndDelete(id);
        res.status(200).json({ message: "Comentario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar comentario:", error);
        res.status(500).json({ message: "Error al eliminar el comentario" });
    }
};


export const comentariosUpdate = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { email, comentario, rating,imagenesConservar } = req.body;
    try {
        const comentaries = await Comentarios.findById(id);
        if (!comentaries) {
             res.status(404).json({ message: "Comentario no encontrado" });
             return;
        }

        if(!Array.isArray(imagenesConservar)){
            imagenesConservar = imagenesConservar ? [imagenesConservar] : [];
        }

        const imagenesConservaran = new Set(imagenesConservar || []);

       const imagesEliminar = comentaries.images.filter((image) => !imagenesConservaran.has(image));
       const imagenesGuardar = comentaries.images.filter((image) => imagenesConservaran.has(image));

       for(const img  of imagesEliminar){
        const fullPath = path.join(__dirname, "../../", img);
        try {
            if(fs.existsSync(fullPath))
             await fs.promises.unlink(fullPath);
        } catch (err) {
            const error = err as Error;
            console.warn(`No se pudo eliminar la imagen ${img}: ${error.message}`);
        }
       }

       if(Array.isArray(req.files) && req.files.length > 0 ){
         const images = (req.files as Express.Multer.File[]).map((file)=> `comentarios/${file.filename}`);
         imagenesGuardar.push(...images);
       }


       comentaries.images = imagenesGuardar;


        comentaries.email = email;
        comentaries.comentario = comentario;
        comentaries.rating = rating;
        await comentaries.save();
        res.status(200).json(comentaries);
    } catch (error) {
        console.error("Error al actualizar comentario:", error);
        res.status(500).json({ message: "Error al actualizar el comentario" });
    }
};