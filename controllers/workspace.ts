import { body, validationResult } from "express-validator";
import prisma from "../models/prismaClient";
import { Request, Response } from "express";
import { AuthRequest } from "../interfaces";
import { WorkspaceEntry } from "../interfaces";

// Create workspace function
export const createWorkSpace = [
  body('name').trim().notEmpty().withMessage('The name is required').escape(),
  async (req: AuthRequest<WorkspaceEntry>, res: Response) => { 
    const result = validationResult(req);
    const { name, description } = req.body;
    const userData = req.user;

    if (!userData) return res.status(400).json({ error: true, message: 'Token not provided'})

    if (result.isEmpty()) {
        const user = await prisma.user.findUnique({
          where: {
            id: userData?.id,
          }
        })
        if(!user) {
          return res.status(404).json({ message: 'User not found', error: true })
        }

        const workspace = await prisma.workspace.create({
          data: {
            name: name,
            description: description
          },
          include: { 
            boards: true
          }
        })
        const workspaceUsers = await prisma.workspaceUsers.create({
          data: {
            userId: user.id,
            workspaceId: workspace.workspaceId
          }
        });
        return res.status(201).json({ message: 'Workspace created', workspace, workspaceUsers })
    }

    return res.status(400).json({ error: true, errorList: result });
  }
];

// Get workspace function
export async function getWorkSpace(req: AuthRequest, res: Response) {
  const { workspaceId } = req.params;
  const userData = req.user;

  try {
      const workspace = await prisma.workspace.findUnique({
        where: { workspaceId: workspaceId },
        include: {
          boards: true
        }
      });

      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found', error: true });
      }
      
      if (workspace.visibilityPublic) {
        return res.status(200).json({ workspace });
      }

      if(req.user) {
        const workspaceUser = await prisma.workspaceUsers.findFirst({
          where: {
            userId: userData?.id,
            workspaceId: workspaceId
          }
        });
        if (workspace.visibilityPrivate && workspaceUser) {
          return res.status(200).json({ workspace });
        }
      }

      return res.status(403).json({ message: 'Access denied', error: true });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}

// Get all workspace from a user
export async function getAllWorkSpaces(req: AuthRequest, res: Response) {
  const userData = req.user;

  try {
    const workspacesData = await prisma.workspaceUsers.findMany({
      where: {
        userId: userData?.id
      },
      include: {
        workspace: {
          include: {
            boards: true
          }
        }
      }
    })
  
    // Extract the contents of each workspace
    const workspaces = workspacesData.map(ws => ws.workspace);

    return res.status(200).json({ workspaces })
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}

// Update workspace
export const updateWorkspace = [
  body('name').trim().notEmpty().withMessage('The name is required').escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { workspaceId } = req.params;

    if(!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array(), error: true });
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { workspaceId: workspaceId },
      data: req.body
    });
    if(!updateWorkspace) {
      return res.status(404).json({ message: 'Error, workspace not found', error: true });
    }
    return res.status(200).json({ message: 'Workspace updated', updatedWorkspace });
  }
]

// Delete workspace
export async function deleteWorkSpace(req: Request, res: Response) {
  const { workspaceId } = req.params;

  try {
    const deleteWorkSpace = await prisma.workspace.delete({
      where: {
        workspaceId: workspaceId,
      },
    });
    return res.status(200).json({ deleteWorkSpace });
  } catch (error) {
    return res.status(400).json({ message: error, error: true})
  }
}