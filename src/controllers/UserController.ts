import { getRepository } from 'typeorm';
import { Request, Response } from '../utils/api';
import { classToPlain, plainToClass } from 'class-transformer';
import { User } from '../entities/User';
import { validate } from 'class-validator';
import { NextFunction } from 'express';
import apiErrors, { ApiError } from '../config/error';

export class UserController {
  static me = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.userId;
    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail({
        where: { id: userId }
      });
    } catch (error) {
      res.apiError = apiErrors.NOT_FOUND;
      return next();
    }

    res.apiData = classToPlain(user);
    // should response found user with status 200: OK
    next();
  };

  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = getRepository(User);
    let users: Array<User> = [];

    try {
      users = await userRepo.find();
    } catch (error) {
      res.apiData = [];
    }

    res.apiData = classToPlain(users);
    // should response all found users with status 200: OK
    next();
  };

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userRepo = getRepository(User);
    const id: number = <number>req.params.id;
    let user: User;

    try {
      user = await userRepo.findOneOrFail(id);
    } catch (error) {
      res.apiError = apiErrors.NOT_FOUND;
      return next();
    }

    res.apiData = classToPlain(user);
    // should response found user with status 200: OK
    next();
  };

  static newUser = async (req: Request, res: Response, next: NextFunction) => {
    let user: User = new User();

    try {
      user = plainToClass(User, req.body, { excludeExtraneousValues: true });
    } catch (error) {
      res.apiError = apiErrors.INVALID_ARGUMENTS;
      return next();
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      res.apiError = apiErrors.INVALID_ARGUMENTS;
      res.apiError.errors = errors;
      // should response error body with details and status 400: Bad Request
      return next();
    }

    user.hashPassword();

    const userRepo = getRepository(User);
    try {
      await userRepo.save(user);
    } catch (error) {
      res.apiError = apiErrors.EMAIL_EXISTS;
      res.apiFailureStatus = 409;
      return next();
    }

    res.apiData = classToPlain(user);
    // should response new user with status 200: OK
    next();
  };

  static editUser = async (req: Request, res: Response, next: NextFunction) => {
    const id: number = <number>req.params.id;
    let newUser: User = new User();

    try {
      newUser = plainToClass(User, req.body, { excludeExtraneousValues: true });
    } catch (error) {
      res.apiError = apiErrors.INVALID_ARGUMENTS;
      return next();
    }

    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail(id);
    } catch (error) {
      res.apiError = apiErrors.NOT_FOUND;
      return next();
    }

    user.email = newUser.email || user.email;
    user.firstName = newUser.firstName || user.firstName;
    user.lastName = newUser.lastName || user.lastName;
    user.age = newUser.age || user.age;
    user.role = newUser.role || user.role;
    user.password = newUser.password || user.password;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.apiError = apiErrors.INVALID_ARGUMENTS;
      res.apiError.errors = errors;
      return next();
    }

    if (newUser.password) {
      user.hashPassword();
    }

    userRepo.save(user);

    res.apiData = classToPlain(user);
    // should response updated user with status 200: OK
    next();
  };

  static deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userRepo = getRepository(User);
    const id: number = <number>req.params.id;

    try {
      await userRepo.findOneOrFail(id);
    } catch (error) {
      res.apiError = apiErrors.NOT_FOUND;
      return next();
    }

    userRepo.delete(id);

    // should response no body with status 204: No Content
    next();
  };
}
