import 'reflect-metadata';
import path from 'path';

import connectRedis from 'connect-redis';
import express, { json, static as expressStatic } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { createClient } from 'redis';
import { config } from 'dotenv';
import cors from 'cors';
import { createConnection, getConnectionOptions } from 'typeorm';
import { errors } from 'celebrate';

import { COOKIE_EXPIRATION_DAYS, COOKIE_NAME, VERSION, __prod__ } from './config';
import routes from './routes';

// Setup app with middleware
const app = express();
app.use(json());
app.use(helmet());

// Setup dotenv and enable cors for dev mode
if (!__prod__) {
  config();
  app.use(cors({ origin: '*', credentials: true }));
}

// Init Redis to store sessions
const RedisStore = connectRedis(session);
const redisClient = createClient({
  // url: process.env.REDIS_URL,
});

app.use(
  // Use cookie session middleware
  session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redisClient,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * COOKIE_EXPIRATION_DAYS, // Number of days until cookie expires
      httpOnly: true, // Set HttpOnly header
      sameSite: 'strict', // Set SameSite header
      secure: __prod__, // Force HTTPS
    },
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false, // Don't save invalid sessions to Redis
    resave: false, // Not needed, as Redis client will already "touch" existing sessions
  })
);

// Use API routes and statically serve the front-end
app.use(`/api/v${VERSION}`, routes);
app.use(expressStatic(path.resolve('public')));
app.get('*', (_, res) => {
  return res.sendFile(path.resolve('public', 'index.html'));
});

// Use validation errors
app.use(errors());

const port = process.env.PORT || 5000;

const start = async () => {
  // read connection options from ormconfig.json
  let connectionOptions = await getConnectionOptions();

  // Override with custom config
  connectionOptions = Object.assign(connectionOptions, { logging: !__prod__ });

  const connection = await createConnection(connectionOptions);
  console.log('Connected to database...');
  await connection.runMigrations();
  app.listen(port, () => console.log('App running on port', port));
};

start();
