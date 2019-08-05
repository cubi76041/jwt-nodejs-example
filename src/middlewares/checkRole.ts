import { NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User, UserRole } from '../entities/User';
import { Response, Request, doApiResponse } from '../utils/api';
import apiErrors from '../config/error';

export const checkRole = (roles: Array<UserRole>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id: number = res.locals.user.userId;

    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail({ where: { id } });
    } catch (error) {}

    if (roles.indexOf(user.role) > -1) {
      next();
    } else {
      res.apiError = apiErrors.PERMISSION_DENIED;
      return doApiResponse(req, res);
    }
  };
};
