import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export async function getCard(_req: Request, _res: Response) {
  // Get card 
}

export async function createCard(req: Request, res: Response) {
  const { title, description, startDate, dueDate } = req.body;

  
}

export async function updateCard() {
  // Update card
}

export async function deleteCard() {
  // Delete card
}