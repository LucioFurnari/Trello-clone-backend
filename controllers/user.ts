import { body, validationResult } from "express-validator";
import prisma from "../models/prismaClient";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from "express";
import { AuthRequest, JwtPayload } from "../interfaces";
import { UserEntry } from "../interfaces";
import 'dotenv/config'

const SECRET_KEY = process.env.SECRET_KEY || process.env.DEV_SECRET_KEY;

export const createUser = [
  body('username').notEmpty().trim().withMessage('The user name is required').escape(),
  body('email').notEmpty().trim().withMessage('The email is required').isEmail().withMessage('Have to be a valid email'),
  body('password').notEmpty().trim().withMessage('The password is required').escape(),
  async (req: Request<{},{},UserEntry>, res: Response) => {
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

export async function getUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(400).json({ message: 'User not logged'});
  }
  const { username, email, id} = req.user
  return res.status(200).json({ message: 'Profile info', user: { username, email, id}});
};

// Function to find user or users list
export async function findUsers(req: AuthRequest, res: Response) {
  const { query } = req.query as { query: string };

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Get the current user's email from req.user (set by the verifyToken middleware)
    const currentUserEmail = req.user?.email;
    // Get the current user's name from req.user (set by the verifyToken middleware)
    const currentUserName = req.user?.username;
    console.log(currentUserEmail)
    let users;

    if (query.includes('@')) {
      const isEmailValid = /\S+@\S+\.\S+/.test(query);
      if (!isEmailValid) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const user = await prisma.user.findUnique({
        where: { email: query },
      });
      users = user && user.email !== currentUserEmail ? [user] : [];
    } else {
      const usersList = await prisma.user.findMany({
        where: {
          name: { contains: query, mode: 'insensitive'},
        },
      });

      users = usersList.filter((user) => user.name !== currentUserName);
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export async function updateUserData() {
  
}

export const loginUser = [
  body('email').trim().notEmpty().withMessage('The user email is required').isEmail().withMessage('The email is not valid'),
  body('password').trim().notEmpty().withMessage('The user password is required').escape(),
  async (req: Request<{},{},UserEntry>, res: Response) => { 
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
          sameSite: 'lax',
          secure: false
        });
        return res.status(200).json({ message: 'User logged', token: token });
      } else {
        return res.status(401).json({ message: 'The password is incorrect'});
      }
    })
  }
]

export async function logout(_req: Request, res: Response) {
  res.clearCookie('access_token')
  return res.json({ message: 'Logout successful'});
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.access_token || req.body.access_token;

  if(token === 'undefined' ) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}