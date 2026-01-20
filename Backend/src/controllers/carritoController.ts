import { Request, Response, RequestHandler } from "express";
import Cart from "../models/carrito";
import Product from "../models/product";

// Obtener el carrito del usuario
export const getCart: RequestHandler = async (req, res) => {
  try {
      const { userId } = req.params;
      
      const cart = await Cart.findOne({ user: userId })
          .populate("user") // Popula la información del usuario
          .populate({
              path: "items.product",
              populate: [
                  { path: "category", model: "Category" }, // Popula la categoría del producto
                  { path: "type", model: "Type" } // Popula el tipo del producto
              ]
          });

      if (!cart) {
          res.status(404).json({ message: "Carrito no encontrado" });
          return;
      }

      res.json({ message: "Carrito obtenido correctamente", cart });
  } catch (error) {
      res.status(500).json({ message: "Error al obtener el carrito", error });
  }
};


// Agregar un producto al carrito

export const addToCart: RequestHandler = async (req, res): Promise<void> => {
    try {
      // Obtener los datos del usuario y los productos a agregar del cuerpo de la solicitud
      const { user, items } = req.body;
  
      // Validar que se hayan proporcionado los datos necesarios
      if (!user || !items || !Array.isArray(items)) {
        // Si no se proporcionaron los datos necesarios, devolver un error 400
        res.status(400).json({ message: "Datos de entrada inválidos" });
        return;
      }
  
      // Buscar el carrito del usuario en la base de datos
      let cart = await Cart.findOne({ user });
      if (!cart) {
        // Si no se encontró el carrito, crear uno nuevo
        cart = new Cart({ user, items: [] });
      }
  
      // Inicializar un arreglo para almacenar errores
      let errors: string[] = [];
  
      // Recorrer los productos a agregar
      for (const item of items) {
         // Obtener el ID del producto y la cantidad a agregar
         const { product, quantity } = item;
  
        // Buscar el producto en la base de datos
        const existingProduct = await Product.findById(product);
        if (!existingProduct) {
          // Si no se encontró el producto, agregar un error al arreglo
          errors.push(`Producto con ID ${product} no encontrado`);
          continue;
        }
  
        // Verificar si hay stock suficiente para agregar la cantidad solicitada
        if (existingProduct.stock < quantity) {
          // Si no hay stock suficiente, agregar un error al arreglo
          errors.push(`Stock insuficiente para ${existingProduct.name}, disponible: ${existingProduct.stock}`);
          continue;
        }
  
        // Verificar si el producto ya se encuentra en el carrito
        const itemIndex = cart.items.findIndex((i) => i.product.toString() === product);
        if (itemIndex > -1) {
          // Si el producto ya se encuentra en el carrito, incrementar la cantidad
          cart.items[itemIndex].quantity += quantity;
        } else {
          // Si el producto no se encuentra en el carrito, agregarlo
          cart.items.push({ product, quantity });
        }
  
        // Actualizar el stock del producto
        existingProduct.stock -= quantity;
        await existingProduct.save();
      }
  
      // Guardar el carrito actualizado
      await cart.save();
  
      // Verificar si se produjeron errores durante el proceso
      if (errors.length > 0) {
        // Si se produjeron errores, devolver un error 207 con los errores y el carrito actualizado
        res.status(207).json({ message: "Algunos productos no pudieron agregarse", errors, cart });
        return;
      }
  
      // Si no se produjeron errores, devolver un mensaje de éxito con el carrito actualizado
      res.json({ message: "Productos agregados al carrito", cart });
      return;
    } catch (error) {
      // Si se produjo un error durante el proceso, devolver un error 500 con el error
      res.status(500).json({ message: "Error al agregar productos al carrito", error });
      return;
    }
};





// Eliminar un producto del carrito
export const removeFromCart: RequestHandler = async (req, res): Promise<void> => {
  try {
      const { userId, productId } = req.params;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
          res.status(404).json({ message: "Carrito no encontrado" });
          return;
      }

      // Buscar el producto en el carrito
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (itemIndex === -1) {
          res.status(404).json({ message: "Producto no encontrado en el carrito" });
          return;
      }

      // Obtener la cantidad del producto que se va a eliminar
      const removedItem = cart.items[itemIndex];
      const quantityToRestore = removedItem.quantity;

      // Eliminar el producto del carrito
      cart.items.splice(itemIndex, 1);
      await cart.save();

      // Restaurar el stock del producto
      const product = await Product.findById(productId);
      if (product) {
          product.stock += quantityToRestore;
          await product.save();
      }

      res.json({ message: "Producto eliminado del carrito y stock actualizado", cart });
  } catch (error) {
      res.status(500).json({ message: "Error al eliminar del carrito", error });
  }
};



// Vaciar el carrito
export const clearCart: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: "Carrito no encontrado" });
      return;
    }

    // 🔹 Recorremos los items y devolvemos el stock a cada producto
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity; // devolvemos cantidad
        await product.save();
      }
    }

    // 🔹 Vaciar el carrito
    cart.items = [];
    await cart.save();

    res.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar el carrito", error });
  }
};


export const updateItemQuantity: RequestHandler = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            res.status(400).json({ message: "La cantidad debe ser al menos 1." });
            return;
        }

        // Buscar el producto y validar stock
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado." });
            return;
        }

        console.log(`📦 Producto ${productId}: Stock disponible ${product.stock}, Cantidad solicitada ${quantity}`);

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Carrito no encontrado." });
            return;
        }

        // Buscar el producto dentro del carrito
        const cartItem = cart.items.find((item) => item.product.toString() === productId);
        if (!cartItem) {
            res.status(404).json({ message: "Producto no encontrado en el carrito." });
            return;
        }

        // Validar si la nueva cantidad es mayor al stock disponible + lo que ya tenía en el carrito
        if (quantity > product.stock + cartItem.quantity) {
            res.status(400).json({ message: `Stock insuficiente. Máximo disponible: ${product.stock + cartItem.quantity}` });
            return;
        }

        // Diferencia entre la nueva cantidad y la actual
        const quantityDifference = quantity - cartItem.quantity;
        console.log(`🔄 Diferencia de cantidad: ${quantityDifference}`);

        if (quantityDifference > 0) {
            // Aumentar cantidad en el carrito y reducir stock
            product.stock -= quantityDifference;
        } else {
            // Disminuir cantidad en el carrito y restaurar stock
            product.stock += Math.abs(quantityDifference);
        }

        // Guardar cambios
        await product.save();

        // Actualizar la cantidad en el carrito
        cartItem.quantity = quantity;
        await cart.save();

        console.log(`✅ Nueva cantidad en carrito: ${cartItem.quantity}, Stock actualizado: ${product.stock}`);

        res.json({ message: "Cantidad actualizada en el carrito.", cart });
    } catch (error) {
        console.error("❌ Error al actualizar cantidad en el carrito:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};
