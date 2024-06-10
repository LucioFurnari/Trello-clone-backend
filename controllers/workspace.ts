import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: any;
}

const prisma = new PrismaClient();

export const createWorkSpace = [
  body('name').notEmpty().trim().escape(),
  async (req: AuthRequest, res: Response) => { 
    const result = validationResult(req);

    if (result.isEmpty()) {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        }
      })
      if(!user) {
        return res.status(404).json({ message: 'User not found', error: true })
      }

      const workspace = await prisma.workspace.create({
        data: {
          name: req.body.name,
          authorId: user.id
        }
      })
      return res.status(201).json({ message: 'Workspace created', workspace })
    }

    return res.status(400).json({ error: true, errorList: result });
  }
];

export async function getWorkSpace(req: Request, res: Response) {
  const { workspace_id } = req.params;

  if( !Number.isNaN(parseInt(workspace_id))) {
    const workspace = await prisma.workspace.findUnique({
      where: { workspace_id: parseInt(workspace_id) }
    });
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found', error: true });
    }
    return res.status(200).json({ workspace });
  }

  return res.status(400).json({ message: 'The id is not a number', error: true })
}

export async function getAllWorkSpaces() {
  
}

export async function updateWorkSpace() {
  
}

export async function deleteWorkSpace() {
  
}