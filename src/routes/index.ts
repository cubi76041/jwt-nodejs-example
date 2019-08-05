import { Router } from 'express';
import * as jwt from 'express-jwt';
import { NextFunction } from 'express';

import auth from './auth';
import user from './user';
import config from '../config/config';
import { Request, Response, doApiResponse } from '../utils/api';
import apiErrors from '../config/error';

const routes = Router();
const jwtMiddleware = jwt({
  secret: config.jwtSecret,
  resultProperty: 'locals.user'
});

routes.use('/auth', auth);
routes.use('/user', jwtMiddleware, user);

routes.use((req: Request, res: Response, next: NextFunction) => {
  res.apiError = apiErrors.NOT_FOUND;
  res.apiFailureStatus = 404;
  doApiResponse(req, res);
});

routes.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.apiError = apiErrors.UNAUTHORIZED;
    res.apiFailureStatus = 401;
    return doApiResponse(req, res);
  }

  next();
});

export default routes;
