import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import config from '../config/config';

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers['auth'];
  let jwtPayload;

  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.status(401).send();
  }

  const { userId, email } = jwtPayload;
  const newToken = jwt.sign({ userId, email }, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
  res.setHeader('token', newToken);

  next();
};
