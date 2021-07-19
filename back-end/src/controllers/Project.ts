import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { getConnection } from 'typeorm';

import { Project } from '../entities/Project';

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
        order: { updatedAt: 'DESC' },
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
        user: () => req.session.userId!,
      })
      .execute();

    return res.status(201).end();
  };

  static delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const project = await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .where('Project.userId = :userId', { userId: req.session.userId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!project) {
      return res.status(404).end();
    }

    await getConnection()
      .getRepository(Project)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return res.status(204).end();
  };
}
