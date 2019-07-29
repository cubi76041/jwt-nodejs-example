import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { checkRole } from '../middlewares/checkRole';
import { UserRole } from '../entities/User';

const routes = Router();

routes.get('/', checkRole([UserRole.ADMIN]), UserController.listAll);
routes.get(
  '/:id([0-9]+)',
  checkRole([UserRole.ADMIN]),
  UserController.getOneById
);
routes.post('/', checkRole([UserRole.ADMIN]), UserController.newUser);
routes.patch(
  '/:id([0-9]+)',
  checkRole([UserRole.ADMIN]),
  UserController.editUser
);
routes.delete(
  '/:id([0-9]+)',
  checkRole([UserRole.ADMIN]),
  UserController.deleteUser
);

export default routes;
