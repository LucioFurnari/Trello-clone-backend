import prisma from "../models/prismaClient";
import { Request, Response } from "express";


export async function addMember(req: Request, res: Response) {
  const { workspaceId } = req.params;
  const { userId } = req.body;

  // Validate input
  if (!workspaceId || !userId) {
    return res.status(400).json({ message: 'Workspace ID and User ID are required' });
  }

  try {
    // Add user to workspace
    const addedUser = await prisma.workspaceUsers.create({
      data: {
        is_admin: false,
        userId,
        workspaceId
      }
    });

    return res.status(201).json({ message: 'User added to the workspace', addedUser });
  } catch (error) {
    console.error('Error adding user to workspace:', error);
    
    // Handle different error types
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }

    // Fallback in case error is not an instance of Error
    return res.status(500).json({ message: 'Internal server error', error: 'Unknown error' });
  }
}