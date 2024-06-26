import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCard(_req: Request, _res: Response) {
  // Get card 
}

export async function createCard(req: Request, res: Response) {
  const { title, description, startDate, dueDate, listId } = req.body;

  const card = await prisma.card.create({
    data: {
      title: title,
      listId: listId
    }
  })

  return res.status(201).json({ message: 'Card created', card})
}

export async function updateCard() {
  // Update card
}

export async function deleteCard() {
  // Delete card
}