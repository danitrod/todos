import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';
import { getConnection } from 'typeorm';
import { hash, verify } from 'argon2';

// import { COOKIE_NAME } from '../config';

import { User } from '../entities/User';
import { COOKIE_NAME } from '../config';

interface RegisterBody {
  username: string;
  name: string;
  password: string;
}

interface LoginBody {
  username: string;
  password: string;
}

export default class UserController {
  static get: RequestHandler = async (req, res) => {
    const user = await getConnection().getRepository(User).findOneOrFail({
      id: req.session.userId,
    });

    return res.status(200).json({
      name: user.name,
    });
  };

  static registerSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string()
        .regex(new RegExp(/[\w ]*/))
        .max(255)
        .required(),
      password: Joi.string().min(6).max(255).required(),
      username: Joi.string().alphanum().min(3).max(255).required(),
    }),
  });

  static register: RequestHandler<unknown, unknown, RegisterBody> = async (req, res) => {
    const { username, name, password } = req.body;

    // Validate username is not taken
    const usernameCount = await getConnection()
      .getRepository(User)
      .createQueryBuilder()
      .where('lower(username) = :username', { username: username.toLowerCase() })
      .getCount();
    if (usernameCount > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password and create user
    const hashedPw = await hash(password);
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        name,
        username,
        password: hashedPw,
      })
      .execute();

    // Create session for user
    req.session.userId = result.identifiers[0].id;

    return res.status(201).end();
  };

  static loginSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().min(3).max(255).alphanum().required(),
      password: Joi.string().min(6).max(255).required(),
    }),
  });

  static login: RequestHandler<unknown, unknown, LoginBody> = async (req, res) => {
    const { username, password } = req.body;

    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder()
      .where('lower(username) = :username', { username: username.toLowerCase() })
      .getOne();

    if (!user) {
      return res.status(404).end();
    }

    const valid = await verify(user.password, password);
    if (!valid) {
      return res.status(401).end();
    }

    // Create session for user
    req.session.userId = user.id;

    return res.status(200).end();
  };

  static logout: RequestHandler = async (req, res) => {
    req.session.destroy((err) => {
      res.clearCookie(COOKIE_NAME);
      const status = err ? 400 : 200;
      return res.status(status).end();
    });
  };
}
