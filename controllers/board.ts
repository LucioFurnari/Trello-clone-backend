import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const prisma = new PrismaClient();

export async function getBoard(_req: Request, _res: Response) {
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

export const updateBoard = [
  body('title').notEmpty().trim().escape(),
  body('description').escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { board_id } = req.params;
    const { title, description } = req.body;

    if (!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array() });
    }
    
    if (!Number.isNaN(parseInt(board_id))) {
      const updatedBoard = await prisma.board.update({
        where: {
          boardId: parseInt(board_id),
        },
        data: {
          title: title,
          description: description,
        }
      });
      return res.status(200).json({ message: 'Board updated correctly', updatedBoard });
    }

    return res.status(400).json({ message: 'The id is not a number', error: true });
  }
]

export async function deleteBoard(req: Request, res: Response) {
  const { board_id } = req.params;

  if(!Number.isNaN(parseInt(board_id))) {
    const deletedBoard = await prisma.board.delete({
      where: {
        boardId: parseInt(board_id),
      }
    });
    return res.status(200).json({ message: 'Board deleted successfully', deletedBoard});
  }

  return res.status(400).json({ message: 'The id is not a number', error: true });
}