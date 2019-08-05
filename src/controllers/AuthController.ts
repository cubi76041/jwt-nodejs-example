import { NextFunction } from 'express';
import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { Request, Response } from '../utils/api';
import { User } from '../entities/User';
import config from '../config/config';
import apiErrors from '../config/error';

class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    if (!(email && password)) {
      res.apiError = apiErrors.INVALID_CREDENTIALS;
      res.apiFailureStatus = 401;
      return next();
    }

    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail({ where: { email } });
    } catch (error) {
      res.apiError = apiErrors.INVALID_CREDENTIALS;
      res.apiFailureStatus = 401;
      return next();
    }

    if (!user.validatePassword(password)) {
      res.apiError = apiErrors.INVALID_CREDENTIALS;
      res.apiFailureStatus = 401;
      return next();
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiration
      }
    );

    res.apiData = {
      token
    };
    res.apiSuccessStatus = 200;

    // should return authenticated token with status 200: OK
    next();
  };
}

export default AuthController;
