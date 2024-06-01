import { body, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import express from 'express';

export const createUser = [
  body('username').trim().notEmpty(),
  body('email').isEmail().notEmpty(),
  body('password').trim().notEmpty(),
  async (req: express.Request, res: express.Response ) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return res.status(200).json({
        message: 'User created!',
      })
    }

    return res.json({ error: true, list: JSON.stringify(result)})
  },
];

export const getUser = async (_req: express.Request, res: express.Response) => {
  return res.status(200).json({
    user: 'User data',
  })
};

export async function generateHash() {
  let result = ''
  bcrypt.hash('bacon', 8, (_error, hash) => {
    result = hash
  });
  return result;
};

//@ts-ignore
async function checkPassword(hash: string) {
  bcrypt.compare('bacon', hash, (error, res) => {
    if (res) {
      console.log('The password is the same :o')
      // something
    }
    console.log(error);
    // res => true or false
  });
}