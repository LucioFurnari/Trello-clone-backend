import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { toNewBoardEntry } from '../types/utils';

const prisma = new PrismaClient();

export async function getBoard(req: Request, res: Response) {
  const { boardId } = req.params;
  
  try {
    const board = await prisma.board.findUnique({
      where: { boardId: Number(boardId) }
    });
  
    if (!board) return res.status(404).json({ message: 'Board not found', error: true});
  
    const lists = await prisma.list.findMany({
      where: {
        boardId: Number(boardId)
      },
      include: {
        cards: true,
      }
    })
  
    return res.status(302).json(lists)
  } catch (error) {
    
  }
}

export const createBoard = [
  body('title').notEmpty().trim().escape(),
  body('description').escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { workspaceId } = req.params;

    const newBoard = toNewBoardEntry(req.body);

    if(result.isEmpty()) {
      try {
        const board = await prisma.board.create({
          data: {
            ...newBoard,
            workspaceId: Number(workspaceId)
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
    const { boardId } = req.params;
    const { title, description } = req.body;

    if (!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array() });
    }
    
    if (!Number.isNaN(Number(boardId))) {
      const updatedBoard = await prisma.board.update({
        where: {
          boardId: parseInt(boardId),
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
  const { boardId } = req.params;

  if(!Number.isNaN(parseInt(boardId))) {
    const deletedBoard = await prisma.board.delete({
      where: {
        boardId: Number(boardId),
      }
    });
    return res.status(200).json({ message: 'Board deleted successfully', deletedBoard});
  }

  return res.status(400).json({ message: 'The id is not a number', error: true });
}