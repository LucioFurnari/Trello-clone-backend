import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function addMember(req: Request, res: Response) {
  const { workspace_id } = req.params;
  const { user_id } = req.body;
  try {
    const addedUser = await prisma.workspaceUsers.create({
      data: {
        is_admin: false,
        userId: user_id,
        workspaceId: parseInt(workspace_id)
      }
    });
  
    return res.status(201).json({ message: 'User added to the workspace', addedUser });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}