import { Router } from 'express';

import { checkJWT } from '../middlewares/checkJwt';
import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', checkJWT, user);

export default routes;
