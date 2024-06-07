import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import express from 'express';

const prisma = new PrismaClient();

export const createUser = [
  body('username').notEmpty().trim().escape(),
  body('email').notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty().trim().escape(),
  async (req: Request, res: Response) => {
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

export async function getUser(_req: Request, res: Response) {
  return res.status(200).json({
    user: 'User data',
  })
};

export async function updateUserData() {
  
}

export const loginUser = [
  body('email').notEmpty().trim().isEmail().normalizeEmail(),
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
interface AuthRequest extends Request {
  user?: any;
}

export function verifyToken(req: AuthRequest, res: express.Response, next: NextFunction) {
  const bearerHeader: string | undefined = req.header('Authorization');

  if(!bearerHeader) {
    return res.status(401).json({ message: 'No token, authorization denied', error: true });
  }

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  try {
    const decoded = jwt.verify(bearerToken, 'your_jwt_secret_key');
    req.user = (decoded as any).user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}