import { body, validationResult } from "express-validator";
import prisma from "../models/prismaClient";
import { Request, Response } from "express";
import { AuthRequest } from "../interfaces";


export const createWorkSpace = [
  body('name').trim().notEmpty().withMessage('The name is required').escape(),
  async (req: AuthRequest, res: Response) => { 
    const result = validationResult(req);
    const { name, description } = req.body;
    const { id } = req.user;

    if (result.isEmpty()) {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        }
      })
      if(!user) {
        return res.status(404).json({ message: 'User not found', error: true })
      }

      const workspace = await prisma.workspace.create({
        data: {
          name: name,
          description: description
        }
      })
      const workspaceUsers = await prisma.workspaceUsers.create({
        data: {
          userId: id,
          workspaceId: workspace.workspaceId
        }
      });
      return res.status(201).json({ message: 'Workspace created', workspace, workspaceUsers })
    }

    return res.status(400).json({ error: true, errorList: result });
  }
];

export async function getWorkSpace(req: AuthRequest, res: Response) {
  const { workspace_id } = req.params;
  const { id } = req.user;

  if(!Number.isNaN(parseInt(workspace_id))) {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { workspaceId: parseInt(workspace_id) }
      });

      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found', error: true });
      }

      const boards = await prisma.board.findMany({
        where: { workspaceId: parseInt(workspace_id)}
      })

      if (!boards) {
        return res.status(404).json({ message: 'Boards not found'});
      }
      
      if (workspace.visibilityPublic) {
        return res.status(200).json({  boards });
      }

      if(req.user) {
        const workspaceUser = await prisma.workspaceUsers.findFirst({
          where: {
            userId: id,
            workspaceId: parseInt(workspace_id)
          }
        });
        if (workspace.visibilityPrivate && workspaceUser) {
          return res.status(200).json({ boards });
        }
      }

      return res.status(403).json({ message: 'Access denied', error: true });
    } catch (error) {
      console.error('Error fetching workspace:', error);
      return res.status(500).json({ message: 'Internal server error', error: true });
    }
  } else {
    return res.status(400).json({ message: 'The id is not a number', error: true })
  }
}

export async function getAllWorkSpaces(req: AuthRequest, res: Response) {
  const { id } = req.user;

  try {
    const workspaces = await prisma.workspaceUsers.findMany({
      where: {
        userId: id
      },
      select: {
        workspace: true
      }
    })
  
    return res.status(200).json({ workspaces })
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}

export const updateWorkspace = [
  body('name').trim().notEmpty().withMessage('The name is required').escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { workspace_id } = req.params;
    const { name, description } = req.body;

    if(!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array(), error: true });
    }

    if(!Number.isNaN(parseInt(workspace_id))) {
      const updatedWorkspace = await prisma.workspace.update({
        where: { workspaceId: parseInt(workspace_id) },
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
          workspaceId: parseInt(workspace_id),
        },
      });
      return res.status(200).json({ deleteWorkSpace });
    }
    return res.status(400).json({ message: 'The id is incorrect', error: true})
  } catch (error) {
    return res.status(400).json({ message: error, error: true})
  }
}