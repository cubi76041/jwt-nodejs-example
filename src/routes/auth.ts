import { Router } from 'express';

import AuthController from '../controllers/AuthController';
import { doApiResponse } from '../utils/api';

const router = Router();

router.post('/login', AuthController.login, doApiResponse);

export default router;
