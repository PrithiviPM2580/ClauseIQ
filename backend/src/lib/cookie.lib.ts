import type { Response, Request } from 'express';
import type { CookieOptions } from 'express';

export const cookies = {
  getOptions: (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  }),

  set: (
    res: Response,
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },

  clear: (res: Response, name: string, options: CookieOptions = {}): void => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },

  get: (req: Request, name: string): string | undefined => {
    return req.cookies[name];
  },
};
