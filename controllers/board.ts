import { Request, Response } from 'express';
import prisma from '../models/prismaClient';
import { body, validationResult } from 'express-validator';
import { NewBoardEntry } from '../interfaces';


export async function getBoard(req: Request, res: Response) {
  const { boardId } = req.params;
  
  try {
    if (!Number.isNaN(Number(boardId))) { 
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
    }
    
    return res.status(400).json({ message: 'The id is not a number', error: true });
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
  async (req: Request<{workspaceId: string},{},NewBoardEntry>, res: Response) => {
    const result = validationResult(req);
    const { title, description, coverImage, coverColor} = req.body;
    const { workspaceId } = req.params;


    if(!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array() });
    }

    try {
      const board = await prisma.board.create({
        data: {
          title,
          description,
          coverImage,
          coverColor,
          workspaceId: Number(workspaceId)
        }
      });
      return res.status(201).json({ message: 'Board created', board: board});
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
  async (req: Request<{boardId: string},{},NewBoardEntry>, res: Response) => {
    const result = validationResult(req);
    const { title, description, coverImage, coverColor} = req.body;
    const { boardId } = req.params;
    

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
            title,
            description,
            coverImage,
            coverColor,
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