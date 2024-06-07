import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';

const prisma = new PrismaClient();

export const createUser = [
  body('username').trim().notEmpty(),
  body('email').isEmail().notEmpty(),
  body('password').trim().notEmpty(),
  async (req: express.Request, res: express.Response) => {
    const { username, email, password} = req.body;
    const result = validationResult(req);

    if (result.isEmpty()) {
      bcrypt.hash(password, 8, async (_error, hash) => {
        await prisma.user.create({
          data: {
            name: username,
            email: email,
            password: hash
          }
        })
      })

      return res.status(200).json({
        message: 'User created!',
      })
    }

    return res.status(400).json({ error: true, errorList: JSON.stringify(result)});
  },
];

export async function getUser(_req: express.Request, res: express.Response) {
  return res.status(200).json({
    user: 'User data',
  })
};

export async function updateUserData() {
  
}

export const loginUser = [
  body('email').trim().notEmpty().isEmail(),
  async (req: express.Request, res: express.Response) => { 
    const { email, password } = req.body;
    const result = validationResult(req);

    if (result.isEmpty()) {
      const user = await prisma.user.findFirst({
        where: {
          email: email
        }
      })

      if (user) {
        bcrypt.compare(password, user?.password, (err, pass) => {
          if (err) {
            // Handle error
            console.error('Error comparing passwords:', err);
            return;
          }

          if (pass) {
            const token = jwt.sign({ user: user }, 'Olivia')
            return res.status(200).json({ message: 'User logged', token });
          } else {
            return res.status(400).json({ message: 'The password is incorrect'});
          }
        })
      }
    } else {
      return res.status(400).json({ error: true, errorList: result.array});
    }
  }
]

export async function logoutUser() {
  
}