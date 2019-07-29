import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { User } from '../entities/User';
import config from '../config/config';

class AuthController {
  static login = async (req: Request, res: Response) => {
    let { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send();
    }

    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail({ where: { email } });
    } catch (error) {
      return res.status(401).send();
    }

    if (!user.validatePassword(password)) {
      return res.status(401).send();
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

    res.send(token);
  };
}

export default AuthController;
