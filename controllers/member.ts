import prisma from "../models/prismaClient";
import { Request, Response } from "express";

export async function addUserToWorkspace(req: Request, res: Response) {
  const { userId } = req.body;
  const { workspaceId } = req.params;

  if (!userId || !workspaceId) {
    return res.status(400).json({ error: 'User ID and Workspace ID are required' });
  }

  try {
    const existingEntry = await prisma.workspaceUsers.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId
        },
      },
    });

    if (existingEntry) {
      return res.status(400).json({ error: 'User is already a member of this workspace'});
    }

    const newWorkspaceUser = await prisma.workspaceUsers.create({
      data: {
        userId: userId,
        workspaceId: workspaceId
      },
    });

    return res.status(201).json(newWorkspaceUser);
  } catch (error) {
    console.error('Error adding user to workspace:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};