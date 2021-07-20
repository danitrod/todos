import { Router } from 'express';

import UserController from './controllers/User';
import { auth } from './middleware/auth';
import ProjectController from './controllers/Project';
import TaskController from './controllers/Task';

const router = Router();

router.post('/user', UserController.registerSchema, UserController.register);
router.get('/user', auth, UserController.get);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.get('/projects', auth, ProjectController.list);
router.post('/project', auth, ProjectController.createSchema, ProjectController.create);
router.delete('/project/:id', auth, ProjectController.delete);

router.get('/tasks', auth, TaskController.listSchema, TaskController.list);
router.post('/task', auth, TaskController.createSchema, TaskController.create);
router.patch('/task/toggle', auth, TaskController.toggleSchema, TaskController.toggle);
router.patch('/task/:id', auth, TaskController.updateSchema, TaskController.update);
router.delete('/task/:id', auth, TaskController.delete);

export default router;
