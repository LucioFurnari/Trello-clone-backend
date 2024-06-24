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
        }
      })
      const workspaceUsers = await prisma.workspace_Users.create({
        data: {
          userId: user.id,
          workspaceId: workspace.workspace_id
        }
      });
      return res.status(201).json({ message: 'Workspace created', workspace, workspaceUsers })
    }

    return res.status(400).json({ error: true, errorList: result });
  }
];

export async function getWorkSpace(req: Request, res: Response) {
  const { workspace_id } = req.params;

  if(!Number.isNaN(parseInt(workspace_id))) {
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

export const updateWorkspace = [
  body('name').notEmpty().trim().escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { workspace_id } = req.params;
    const { name, description } = req.body;

    if(!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array(), error: true });
    }

    if(!Number.isNaN(parseInt(workspace_id))) {
      const updatedWorkspace = await prisma.workspace.update({
        where: { workspace_id: parseInt(workspace_id) },
        data: { name: name, description: description }
      });
      if(!updateWorkspace) {
        return res.status(404).json({ message: 'Error, workspace not found', error: true });
      }
      return res.status(200).json({ message: 'Workspace updated', updatedWorkspace });
    }
  }
]

export async function deleteWorkSpace(req: Request, res: Response) {
  const { workspace_id } = req.params;

  try {
    if(!Number.isNaN(parseInt(workspace_id))) {
      const deleteWorkSpace = await prisma.workspace.delete({
        where: {
          workspace_id: parseInt(workspace_id),
        },
      });
      return res.status(200).json({ deleteWorkSpace });
    }
    return res.status(400).json({ message: 'The id is incorrect', error: true})
  } catch (error) {
    return res.status(400).json({ message: error, error: true})
  }
}