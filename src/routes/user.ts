import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { checkRole } from '../middlewares/checkRole';
import { UserRole } from '../entities/User';
import { doApiResponse } from '../utils/api';

const routes = Router();

routes.get('/me', UserController.me, doApiResponse);
routes.get(
  '/:id([0-9]+)',
  checkRole([UserRole.ADMIN]),
  UserController.getOneById,
  doApiResponse
);
routes.get(
  '/',
  checkRole([UserRole.ADMIN]),
  UserController.listAll,
  doApiResponse
);

routes.patch(
  '/:id([0-9]+)',
  checkRole([UserRole.ADMIN]),
  UserController.editUser,
  doApiResponse
);
routes.post(
  '/',
  checkRole([UserRole.ADMIN]),
  UserController.newUser,
  doApiResponse
);

routes.delete(
  '/:id([0-9]+)',
  checkRole([UserRole.ADMIN]),
  UserController.deleteUser,
  doApiResponse
);

export default routes;
