import prisma from "../models/prismaClient";
import { Request, Response } from "express";


export async function addMember(req: Request, res: Response) {
  const { workspaceId } = req.params;
  const { userId } = req.body;
  try {
    const addedUser = await prisma.workspaceUsers.create({
      data: {
        is_admin: false,
        userId: userId,
        workspaceId: parseInt(workspaceId)
      }
    });
  
    return res.status(201).json({ message: 'User added to the workspace', addedUser });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}