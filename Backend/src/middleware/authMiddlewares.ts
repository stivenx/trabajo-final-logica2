const jwt = require('jsonwebtoken');

import { Request, Response, NextFunction } from "express";



interface RequestWithUser extends Request {
  user: any;
}


export const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction): void => {
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
  req.user = decoded;
  next();
};



export { RequestWithUser };