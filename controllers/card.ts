import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { parse } from 'date-fns';
import { toNewCardEntry } from '../types/utils';

const prisma = new PrismaClient();

export async function getCard(req: Request, res: Response) {
  const { cardId } = req.params;

  try {
    const card = await prisma.card.findUnique({
      where: {
        cardId: parseInt(cardId)
      }
    });

    if (!card) return res.status(404).json({ message: 'Card not found', error: true });

    return res.status(200).json({ message: 'Card found', card });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}

export const createCard = [
  body('title').trim().notEmpty().withMessage('Title is required').escape(),
  body('description').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('coverColor').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('coverImage').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('startDate').optional().trim()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('dueDate').optional().trim()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
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

    const startDateObject = parse(startDate, 'MM/dd/yyyy', new Date());
    const dueDateObject = parse(dueDate, 'MM/dd/yyyy hh:mm a', new Date());
    const newCard = toNewCardEntry(req.body, startDateObject, dueDateObject);

    const card = await prisma.card.create({
      data: {
        title: title,
        listId: parseInt(listId),
        description: description,
        startDate: startDateObject,
        dueDate: dueDateObject,
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

export const updateCard = [
  body('title').trim().notEmpty().withMessage('Title is required').escape(),
  body('description').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('coverColor').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('coverImage').optional().trim().escape()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('startDate').optional().trim()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  body('dueDate').optional().trim()
    .customSanitizer(value => {
      if (!value) return null; // Handle empty string and falsy values
      return value;
    }),
  async (req: Request, res: Response) => {
    const { title, description, startDate, dueDate, coverColor, coverImage } = req.body;
    const { cardId } = req.params;

    const startDateObject = parse(startDate, 'MM/dd/yyyy', new Date());
    const dueDateObject = parse(dueDate, 'MM/dd/yyyy hh:mm a', new Date());

    try {
      const card = await prisma.card.update({
        where: {
          cardId: parseInt(cardId)
        },
        data: {
          title: title,
          description: description,
          startDate: startDateObject,
          dueDate: dueDateObject,
          coverColor: coverColor,
          coverImage: coverImage
        }
      });

      if (!card) return res.status(404).json({ message: 'Card not found', error: true });

    } catch (error) {
      console.error('Error fetching workspace:', error);
      return res.status(500).json({ message: 'Internal server error', error: true });
    }
  }
];

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