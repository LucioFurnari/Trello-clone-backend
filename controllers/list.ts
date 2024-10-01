import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import { body, validationResult } from "express-validator";
import { NewListEntry } from "../interfaces";

// Create List function
export const createList = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  async (req: Request<{boardId: string},{},NewListEntry>, res: Response) => {
    const result = validationResult(req);
    const { boardId } = req.params;
    const { name } = req.body;

    if(!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array() })
    }

    const lastList = await prisma.list.findMany({
      where: {
        boardId: boardId,
      },
      orderBy: {
        position: 'desc',
      }
    })
    
    if (lastList.length === 0) {
      const list = await prisma.list.create({
        data: {
          name: name,
          boardId: boardId,
          position: 0
        }
      });
      return res.status(200).json({ message: 'List created', list});
    } else {
      const list = await prisma.list.create({
        data: {
          name: name,
          boardId: boardId,
          position: lastList[0].position + 1,
        }
      });
      return res.status(200).json({ message: 'List created', list});
    }
  }
]

// Delete list function
export async function deleteList(req: Request, res: Response) {
  const { listId, boardId } = req.params;

  try {

    const existingList = await prisma.list.findUnique({
      where: { listId: listId },
    });
    if (!existingList) {
      return res.status(404).json({ message: 'List not found' });
    }
    const list = await prisma.list.delete({
      where: { listId: listId },
    });
    const updatedList = await prisma.list.updateMany({
      where: {
        AND: [
          { boardId: boardId },
          { position: { gte: list.position } },
        ],
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });

      return res.status(200).json({ message: 'List deleted', list, updatedList });
  } catch (error) {
    console.error('Error deleting list:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}

// Update position function
export async function updatePosition(req: Request, res: Response) {
  const { newList, newCards } = req.body;
  
  if (!newList || !newCards) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const updateList = newList.map((item: { listId: string }, index: number) => {
      return prisma.list.update({
        where: { listId: item.listId },
        data: { position: index }, // Set the new position
      });
    });

    const updateCards = newCards.map((card: { cardId: string; listId: string }, index: number) => {
      return prisma.card.update({
        where: { cardId: card.cardId },
        data: {
          listId: card.listId, // Move card to the new list
          position: index,     // Update card's position in the list
        },
      });
    });

    // Combine both updates into a single transaction
    await prisma.$transaction([...updateList, ...updateCards]);

    res.status(200).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error updating positions:', error);
    res.status(500).json({ message: 'Error saving order' });
  }
}