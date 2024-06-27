import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCard(_req: Request, _res: Response) {
  // Get card 
}

export const createCard = [
  body('title').notEmpty().trim().escape(),
  body('description').trim().escape(),
  async (req: Request, res: Response) => {
    const { title, description, startDate, dueDate, coverColor, coverImage } = req.body;
    const { listId } = req.params;

    const result = validationResult(req);

    if(!result.isEmpty()){
      return res.status(400).json({ errors: result.array()});
    }
    try {
    const list = await prisma.list.findUnique({
      where: {
        listId: parseInt(listId)
      }
    });

    if (!list) return res.status(404).json({ message: 'List not found', error: true});

    const card = await prisma.card.create({
      data: {
        title: title,
        listId: parseInt(listId),
        description: description,
        startDate: startDate,
        dueDate: dueDate,
        coverColor: coverColor,
        coverImage: coverImage
      }
    });

    return res.status(201).json({ message: 'Card created', card})
    } catch (error) {
      console.error('Error fetching workspace:', error);
      return res.status(500).json({ message: 'Internal server error', error: true });
    }
  }
];

export async function updateCard() {
  // Update card
}

export async function deleteCard(req: Request, res: Response) {
  const { cardId } = req.params;

  try {
    const card = await prisma.card.delete({
      where: {
        cardId: parseInt(cardId)
      }
    });
  
    if (!card) return res.status(404).json({ message: 'Card not found' });
  
    return res.status(200).json({ message: 'Card deleted', card })
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}