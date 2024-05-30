import { body, validationResult } from "express-validator";
import { Request } from "express-validator/lib/base";

export const createUser = [
  body('username').trim().notEmpty(),
  body('email').isEmail().notEmpty(),
  body('password').trim().notEmpty(),
  async (req: Request, res: { json: (arg0: { message?: string; error?: boolean; }) => any; }) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return res.json({
        message: 'User created!',
      })
    }

    return res.json({ error: true})
  },
];

export const getUser = async (_req: Request, res: { json: (arg0: { user: string; }) => void; }) => {
  res.json({
    user: 'User data',
  })
};