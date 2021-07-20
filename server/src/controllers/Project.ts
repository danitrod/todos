import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { getConnection } from 'typeorm';

import { Project } from '../entities/Project';
import { Task } from '../entities/Task';

interface CreateBody {
  name: string;
}

export default class ProjectController {
  static list: RequestHandler = async (req, res) => {
    const projects = await getConnection()
      .getRepository(Project)
      .find({
        where: {
          user: {
            id: req.session.userId,
          },
        },
        order: { createdAt: 'ASC' },
      });

    return res.status(200).json(projects);
  };

  static createSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string()
        .regex(new RegExp(/[\w\d ]*/))
        .max(255)
        .required(),
    }),
  });

  static create: RequestHandler = async (req, res) => {
    const { name }: CreateBody = req.body;

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Project)
      .values({
        name,
        user: () => req.session.userId!.toString(),
      })
      .execute();

    return res.status(201).end();
  };

  static delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    // Validate user owns the project
    const project = await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .where('Project.userId = :userId', { userId: req.session.userId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!project) {
      return res.status(404).end();
    }

    // Delete all tasks for project
    await getConnection()
      .getRepository(Task)
      .createQueryBuilder()
      .delete()
      .where('projectId = :id', { id })
      .execute();

    // Delete project
    await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return res.status(204).end();
  };
}
