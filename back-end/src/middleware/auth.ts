import { RequestHandler } from 'express';

export const auth: RequestHandler = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).send('Unauthorized');
  }
  next();
};
