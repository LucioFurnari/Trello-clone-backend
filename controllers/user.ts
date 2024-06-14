import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import express from 'express';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.DEV_SECRET_KEY;

export const createUser = [
  body('username').notEmpty().trim().withMessage('The user name is required').escape(),
  body('email').notEmpty().trim().withMessage('The email is required').isEmail().withMessage('Have to be a valid email'),
  body('password').notEmpty().trim().withMessage('The password is required').escape(),
  async (req: Request, res: Response) => {
    const { username, email, password} = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) return res.status(400).json({ error: true, errorList: result.array()});

    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      }
    });

    if (user) return res.status(409).json({ message: 'Email already have an account'});

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
];

export async function getUser(_req: Request, res: Response) {
  return res.status(200).json({
    user: 'User data',
  })
};

export async function updateUserData() {
  
}

export const loginUser = [
  body('email').notEmpty().trim().isEmail(),
  body('password').notEmpty().trim().escape(),
  async (req: Request, res: Response) => { 
    const { email, password } = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) return res.status(400).json({ error: true, errorList: result.array()});

    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found', error: true });
    }
    bcrypt.compare(password, user!.password, (err, pass) => {
      if (err) {
        // Handle error
        console.error('Error comparing passwords:', err);
        return;
      }

      if (pass) {
        const token = jwt.sign(
          { username: user.name, email: user.email, id: user.id },
          SECRET_KEY,
          {
            expiresIn: '1h',
          }
        )
        res.cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'strict'
        });
        return res.status(200).json({ message: 'User logged' });
      } else {
        return res.status(401).json({ message: 'The password is incorrect'});
      }
    })
  }
]

interface AuthRequest extends Request {
  user?: any;
}

export function verifyToken(req: AuthRequest, res: express.Response, next: NextFunction) {
  const token = req.cookies.access_token;

  if(!token) {
    return res.status(401).json({ message: 'Token not found', error: true });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}