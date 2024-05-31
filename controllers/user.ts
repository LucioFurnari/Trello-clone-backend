import { body, validationResult } from "express-validator";
import { Request } from "express-validator/lib/base";
import bcrypt, { hash } from 'bcrypt';

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

async function generateHash() {
  bcrypt.hash('B4c0/\/', 8, (error, hash) => {
    console.log(hash);
  });
};

async function checkPassword(hash: string) {
  bcrypt.compare('B4c0/\/', hash, (error, res) => {
    if (res) {
      // something
    }
    console.log(error);
    // res => true or false
  });
}