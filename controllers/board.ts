import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { toNewBoardEntry } from '../types/utils';

const prisma = new PrismaClient();

export async function getBoard(req: Request, res: Response) {
  const { boardId } = req.params;
  
  try {
    const board = await prisma.board.findUnique({
      where: { boardId: Number(boardId) },
      include: {
        lists: {
          include: {
            cards: true,
          }
        },
      }
    });
  
    if (!board) return res.status(404).json({ message: 'Board not found', error: true});
    
    return res.status(302).json(board);
  } catch (error) {
    console.error('Error getting board', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const createBoard = [
  body('title').trim().notEmpty().withMessage('Title is required').escape(),
  body('description').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { workspaceId } = req.params;

    const newBoard = toNewBoardEntry(req.body);

    if(!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array() });
    }

    try {
      const board = await prisma.board.create({
        data: {
          ...newBoard,
          workspaceId: Number(workspaceId)
        }
      });
      return res.status(201).json({ board });
    } catch (error) {
      console.error('Error creating board', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
];

export const updateBoard = [
  body('title').trim().notEmpty().withMessage('Title is required').escape(),
  body('description').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { boardId } = req.params;
    
    const newBoard = toNewBoardEntry(req.body);

    if (!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array() });
    }
    try {
      if (!Number.isNaN(Number(boardId))) {
        const updatedBoard = await prisma.board.update({
          where: {
            boardId: parseInt(boardId),
          },
          data: {
            ...newBoard,
          }
        });
        return res.status(200).json({ message: 'Board updated correctly', updatedBoard });
      }

      return res.status(400).json({ message: 'The id is not a number', error: true });
    } catch (error) {
      console.error('Error updating board', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
]

export async function deleteBoard(req: Request, res: Response) {
  const { boardId } = req.params;

  try {
    if(!Number.isNaN(Number(boardId))) {
      const deletedBoard = await prisma.board.delete({
        where: {
          boardId: Number(boardId),
        }
      });

      if (!deleteBoard) {
        return res.status(404).json({ message: 'Board not found', error: true });
      }
      return res.status(200).json({ message: 'Board deleted successfully', deletedBoard});
    }

    return res.status(400).json({ message: 'The id is not a number', error: true });
  } catch (error) {
    console.error('Error updating board', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}