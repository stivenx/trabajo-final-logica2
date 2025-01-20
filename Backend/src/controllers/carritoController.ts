import { Request , Response, NextFunction } from 'express';
import User from '../models/user';
import Carrito from '../models/carrito';

import { RequestWithUser } from '../middleware/authMiddlewares';



export const getCarrito = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const carrito = await Carrito.findOne({ user: req.user._id });
    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(carrito);
  } catch (error) {
    next(error);
  }
};

export const agregarProducto = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const carrito = await Carrito.findOne({ user: req.user._id });
    if (!carrito) {
      const nuevoCarrito = new Carrito({ user: req.user._id });
      nuevoCarrito.products.push(req.body.productoId);
      await nuevoCarrito.save();
      res.json(nuevoCarrito);
    } else {
      carrito.products.push(req.body.productoId);
      await carrito.save();
      res.json(carrito);
    }
  } catch (error) {
    next(error);
  }
};

export const eliminarProducto = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const carrito = await Carrito.findOne({ user: req.user._id });
    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    const indice = carrito.products.indexOf(req.body.productoId);
    if (indice !== -1) {
      carrito.products.splice(indice, 1);
      await carrito.save();
      res.json(carrito);
    } else {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    next(error);
  }
};

export const actualizarTotal = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const carrito = await Carrito.findOne({ user: req.user._id });
    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    carrito.total = req.body.total;
    await carrito.save();
    res.json(carrito);
  } catch (error) {
    next(error);
  }
};