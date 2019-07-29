import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { classToPlain, plainToClass } from 'class-transformer';
import { User } from '../entities/User';
import { validate } from 'class-validator';

export class UserController {
  static listAll = async (req: Request, res: Response) => {
    const userRepo = getRepository(User);
    let users: Array<User> = [];

    try {
      users = await userRepo.find();
    } catch (error) {}

    res.json(classToPlain(users));
  };

  static getOneById = async (req: Request, res: Response) => {
    const userRepo = getRepository(User);
    const id: number = <number>req.params.id;
    let user: User;

    try {
      user = await userRepo.findOneOrFail(id);
    } catch (error) {
      return res.status(404).send('User not found');
    }

    res.json(classToPlain(user));
  };

  static newUser = async (req: Request, res: Response) => {
    let user: User = new User();

    try {
      user = plainToClass(User, req.body, { excludeExtraneousValues: true });
    } catch (error) {
      return res.status(400).send();
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    user.hashPassword();

    const userRepo = getRepository(User);
    try {
      await userRepo.save(user);
    } catch (error) {
      return res.status(409).send('email is already exists');
    }

    res.status(201).json(classToPlain(user));
  };

  static editUser = async (req: Request, res: Response) => {
    const id: number = <number>req.params.id;
    let newUser: User = new User();

    try {
      newUser = plainToClass(User, req.body, { excludeExtraneousValues: true });
    } catch (error) {
      return res.status(400).send();
    }

    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail(id);
    } catch (error) {
      return res.status(404).send('user not found');
    }

    user.email = newUser.email || user.email;
    user.firstName = newUser.firstName || user.firstName;
    user.lastName = newUser.lastName || user.lastName;
    user.age = newUser.age || user.age;
    user.role = newUser.role || user.role;
    user.password = newUser.password || user.password;

    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    if (newUser.password) {
      user.hashPassword();
    }

    userRepo.save(user);

    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    const userRepo = getRepository(User);
    const id: number = <number>req.params.id;
    let user: User;

    try {
      user = await userRepo.findOneOrFail(id);
    } catch (error) {
      return res.status(404).send('User not found');
    }

    userRepo.delete(id);
    res.send(204);
  };
}
