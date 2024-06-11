import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const prisma = new PrismaClient();

export async function getBoard(_req: express.Request, _res: express.Response) {
  // Get board from request.board_id
}

export const createBoard = [
  body('title').notEmpty().trim().escape(),
  body('description').escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { title,  description } = req.body;
    const { workspace_id } = req.params;

    if(result.isEmpty()) {
      try {
        const board = await prisma.board.create({
          data: {
            title: title,
            description: description,
            workspaceId: parseInt(workspace_id)
          }
        });
        return res.status(200).json({ board });
      } catch (error) {
        return res.status(400).json({ error });
      }
    }

    return res.status(400).json({ errorList: result.array() });
  }
];

export async function updateBoard() {
  
}

export async function deleteBoard() {
  
}