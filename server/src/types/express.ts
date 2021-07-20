// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}
