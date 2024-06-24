import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function addMember(req: Request, res: Response) {
  const { workspace_id } = req.params;
  const { user_id } = req.body;

  const addedUser = await prisma.workspace_Users.create({
    data: {
      is_admin: false,
      userId: user_id,
      workspaceId: parseInt(workspace_id)
    }
  });

  return res.status(201).json({ message: 'User added to the workspace', addedUser });
}