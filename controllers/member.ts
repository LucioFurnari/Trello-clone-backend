import prisma from "../models/prismaClient";
import { Request, Response } from "express";

// Add user to workspace
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
          workspaceId: workspaceId,
        },
      },
    });

    // Check if user is already in the workspace
    if (existingEntry) {
      return res.status(400).json({ error: 'User is already a member of this workspace'});
    }

    // Create new workspaceUsers
    const newWorkspaceUser = await prisma.workspaceUsers.create({
      data: {
        userId: userId,
        workspaceId: workspaceId,
        is_admin: false,
      },
    });

    return res.status(201).json(newWorkspaceUser);
  } catch (error) {
    console.error('Error adding user to workspace:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all the members from a workspace
export async function getMembersFromWorkspace(req: Request, res: Response) {
  const { workspaceId } = req.params;

  if (!workspaceId) {
    return res.status(400).json({ error: 'Workspace ID is required' });
  }

  try {
    const membersList = await prisma.workspaceUsers.findMany({
      where: {
        workspaceId: workspaceId
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!membersList.length) {
      return res.status(404).json({ error: 'No members found for this workspace' });
    }

    // Flatten the result to extract only the user data
    const members = membersList.map((member) => member.user);

    return res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    return res.status(500).json({ error: 'Failed to retrieve members' });
  }
}