import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { getConnection } from 'typeorm';

import { Task } from '../entities/Task';
import { Project } from '../entities/Project';

interface ListBody {
  projectId: string;
}

interface CreateBody {
  description: string;
  projectId: string;
}

interface ToggleBody {
  done: boolean;
  id: string;
}

interface UpdateBody {
  description: string;
}

export default class TaskController {
  static list: RequestHandler = async (req, res) => {
    const { projectId }: ListBody = req.body;

    // Validate project exists and is owned by user
    const project = await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .where('id = :projectId', { projectId })
      .andWhere('Project.userId = :id', { id: req.session.userId })
      .getOne();
    if (!project) {
      return res.status(404).end();
    }

    const tasks = await getConnection()
      .getRepository(Task)
      .find({
        where: {
          project: {
            id: projectId,
          },
        },
        order: { createdAt: 'ASC' },
      });

    return res.status(200).json(tasks);
  };

  static createSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
      description: Joi.string()
        .regex(new RegExp(/[\w\d ]*/))
        .max(255)
        .required(),
      projectId: Joi.string().required(),
    }),
  });

  static create: RequestHandler = async (req, res) => {
    const { description, projectId }: CreateBody = req.body;

    // Validate project exists and is owned by user
    const project = await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .where('id = :projectId', { projectId })
      .andWhere('Project.userId = :id', { id: req.session.userId })
      .getOne();
    if (!project) {
      return res.status(404).end();
    }

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Task)
      .values({
        description,
        project,
        done: false,
      })
      .execute();

    return res.status(201).end();
  };

  static toggleSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
      done: Joi.bool().required(),
      id: Joi.string().required(),
    }),
  });

  static toggle: RequestHandler = async (req, res) => {
    const { done, id }: ToggleBody = req.body;

    // Validate task project is owned by user
    const task = await getConnection()
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      return res.status(404).end();
    }

    const project = await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .where('id = :projectId', { projectId: task.project.id })
      .andWhere('Project.userId = :id', { id: req.session.userId })
      .getOne();

    if (!project) {
      return res.status(404).end();
    }

    await getConnection()
      .getRepository(Task)
      .createQueryBuilder()
      .update()
      .set({ done, finishedAt: done ? new Date() : undefined })
      .where('id = :id', { id })
      .execute();

    return res.status(200).end();
  };

  static updateSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
      description: Joi.string().max(255).required(),
    }),
  });

  static update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { description }: UpdateBody = req.body;

    const task = await getConnection()
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      return res.status(404).end();
    }

    const project = await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .where('id = :projectId', { projectId: task.project.id })
      .andWhere('Project.userId = :id', { id: req.session.userId })
      .getOne();

    if (!project) {
      return res.status(404).end();
    }

    await getConnection()
      .getRepository(Task)
      .createQueryBuilder()
      .update()
      .set({ description })
      .where('id = :id', { id })
      .execute();

    return res.status(200).end();
  };

  static delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const task = await getConnection()
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      return res.status(404).end();
    }

    const project = await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .where('id = :projectId', { projectId: task.project.id })
      .andWhere('Project.userId = :id', { id: req.session.userId })
      .getOne();

    if (!project) {
      return res.status(404).end();
    }

    await getConnection()
      .getRepository(Task)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return res.status(204).end();
  };
}
