import { Router } from 'express';

import User from './controllers/User';
import { auth } from './middleware/auth';

const router = Router();

router.post('/user', User.registerSchema, User.register);
router.post('/login', User.login);
router.get('/auth', auth);

export default router;
