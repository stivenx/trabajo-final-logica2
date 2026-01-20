import { Request, Response } from "express";
import prueba from "../models/prueba";
import multer from "multer";
import path from "path";
import fs from "fs";

// Almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });

export const createPrueba = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;


    const existingPrueba = await prueba.findOne({ name });

    if (existingPrueba) {
     

      if(req.files){
        
        for (let file of req.files as Express.Multer.File[]) {
          existingPrueba.images.push(`uploads/${file.filename}`);
        }
      }
      
      await existingPrueba.save();
      res.status(200).json(existingPrueba);
      return;
    }else{
       // Guardar rutas de las imágenes subidas
    
    const imagePaths = req.files
      ? (req.files as Express.Multer.File[]).map((file) => `uploads/${file.filename}`)
      : []; 

      /*let imagePaths: string[] = [];

        if (req.files) {
          const files = req.files as Express.Multer.File[];
          for (let i = 0; i < files.length; i++) {
            imagePaths.push(`uploads/${files[i].filename}`);
          }
        }
        */
    const nuevo = new prueba({
      name,
      description,
      price,
      images: imagePaths,
    });

    const saved = await nuevo.save();
    res.status(201).json(saved);

    }
   
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

export const getPruebas = async (req: Request, res: Response) => {
  try {
    const productos = await prueba.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getPrueba = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await prueba.findById(id);
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

/*
para la primer imagen
export const getPrueba = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar el producto y devolver solo los campos deseados
    const producto = await prueba.findById(
      id,
      {
        name: 1,
        description: 1,
        price: 1,
        images: { $slice: 1 } // ← Devuelve solo la PRIMERA imagen
      }
    );

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

*/

/*
otra forma para obtener la primera imagen
export const getPrueba = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await prueba.findById(id);
    if(!producto){
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
     // Solo tomar la primera imagen
    const productoConPrimeraImagen = {
      ...producto.toObject(),
      images: producto.images.length > 0 ? [producto.images[0]] : [],
    };
    res.status(200).json(productoConPrimeraImagen);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};*/


/*
para no tener que hacer un map sino que la primera imagen venga
export const getPrueba = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const producto = await prueba.findById(
      id,
      {
        name: 1,
        description: 1,
        price: 1,
        images: 1
      }
    );

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Tomamos la primera imagen
    const respuesta = {
      _id: producto._id,
      name: producto.name,
      description: producto.description,
      price: producto.price,
      image: producto.images.length > 0 ? producto.images[0] : null
    };

    res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};


*/

// import fs from "fs"; // Descomenta si deseas eliminar archivos físicamente

export const updatePrueba = async (req: Request, res: Response) => {
  try {
    // Obtener el ID desde los parámetros de la ruta
    const { id } = req.params;

    // Obtener datos enviados desde el cuerpo de la petición
    let { name, description, price, imagesToDelete } = req.body;

    // Si imagesToDelete viene como string (FormData lo envía así), parsearlo
    if (typeof imagesToDelete === "string") {
      try {
        imagesToDelete = JSON.parse(imagesToDelete);
      } catch (err) {
        console.error("Error al parsear imagesToDelete:", err);
        imagesToDelete = [];
      }
    }

    // Buscar el producto por ID
    const producto = await prueba.findById(id);
    if (!producto) {
       res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    // Copiar las imágenes actuales
    let currentImages = producto.images;

    // Eliminar imágenes si se especificaron
    if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
      currentImages = currentImages.filter(
        (img: string) =>
          !imagesToDelete.some((toDelete: string) => img.includes(toDelete))
      );

      /*
      if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
        currentImages = currentImages.filter(
          (img: string) => !imagesToDelete.includes(img)
        );
      }
      */

      // Eliminar físicamente las imágenes del sistema de archivos (opcional)
      
     const basePath = path.join(__dirname, "../../"); // ruta base del proyecto

    imagesToDelete.forEach((imgPath: string) => {
      const fullPath = path.join(basePath, imgPath); // une ruta base + nombre
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error al eliminar archivo:", err);
      });
     });

    }

   /*

    for (const imgPath of imagesToDelete) {
      const fullPath = path.join(basePath, imgPath);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error al eliminar archivo:", err);
      });
    }

   */
    // Obtener nuevas imágenes subidas
    const newImagePaths = req.files
      ? (req.files as Express.Multer.File[]).map((file) => `uploads/${file.filename}`)
      : [];

    // Combinar imágenes finales
    const updatedImages = [...currentImages, ...newImagePaths];

    // Actualizar campos
    producto.name = name || producto.name;
    producto.description = description || producto.description;
    producto.price = price || producto.price;
    producto.images = updatedImages;

    // Guardar cambios
    const updated = await producto.save();

    // Enviar respuesta
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const deletePrueba = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const producto = await prueba.findById(id);
    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    const imagenes = producto.images

    for (const imgPath of imagenes) {
      const fullPath = path.join(__dirname, "../../", imgPath); // ajusta si guardas rutas absolutas
      try {
        await fs.promises.unlink(fullPath);
      } catch (err) {
         const error = err as Error;
         console.warn(`No se pudo eliminar la imagen ${imgPath}: ${error.message}`);
      }
    }
    

    const deleted = await prueba.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
