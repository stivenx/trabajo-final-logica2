const jwt = require('jsonwebtoken');

import { Request, Response, NextFunction } from "express";





export const verifyToken = (req: Request, res: Response, next: NextFunction): void   => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
     res.status(401).send({ message: 'No token provided' });
     return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(401).send({ message: 'Invalid token' });
    return;
  }
  (req as any).user = decoded;
  next();
};


