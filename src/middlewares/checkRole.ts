import { Response, Request, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User, UserRole } from '../entities/User';

export const checkRole = (roles: Array<UserRole>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id: number = res.locals.jwtPayload.userId;

    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail({ where: { id } });
    } catch (error) {
      return res.status(401).send();
    }

    if (roles.indexOf(user.role) > -1) {
      next();
    } else {
      return res.status(401).send();
    }
  };
};
