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

    if(!Number.isNaN(parseInt(boardId))) {
      const lastList = await prisma.list.findMany({
        where: {
          boardId: parseInt(boardId),
        },
        orderBy: {
          position: 'desc',
        }
      })
      
      if (lastList.length === 0) {
        const list = await prisma.list.create({
          data: {
            name: name,
            boardId: parseInt(boardId),
            position: 0
          }
        });

        return res.status(200).json({ message: 'List created', list});
      } else {
        const list = await prisma.list.create({
          data: {
            name: name,
            boardId: parseInt(boardId),
            position: lastList[0].position + 1,
          }
        });

        return res.status(200).json({ message: 'List created', list});
      }

    }
    return res.status(400).json({ message: 'The board id is not valid', error: true });
  }
]

// Delete list function
export async function deleteList(req: Request, res: Response) {
  const { listId, boardId } = req.params;

  try {
    const parsedListId = parseInt(listId);

    if (!Number.isNaN(parsedListId)) {
      const existingList = await prisma.list.findUnique({
        where: { listId: parsedListId },
      });

      if (!existingList) {
        return res.status(404).json({ message: 'List not found' });
      }

      const list = await prisma.list.delete({
        where: { listId: parsedListId },
      });

      const updatedList = await prisma.list.updateMany({
        where: {
          AND: [
            { boardId: parseInt(boardId) },
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
    }

    return res.status(400).json({ message: 'The list id is not valid', error: true });
  } catch (error) {
    console.error('Error deleting list:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}

// Update position function
export async function updatePosition(req: Request, res: Response) {
  const { newList, newCards } = req.body;
  // const { boardId, listId } = req.params; moveTo,
  
  try {
    const updatePromises = newList.map((item: { listId: number; }, index: number) =>
      prisma.list.update({
        where: { listId: item.listId },
        data: { position: index },
      })
    );

    const updateCards = newCards.map((card: { cardId: number; listId: number}) => 
      prisma.card.update({
        where: { cardId: card.cardId },
        data: { listId: card.listId }
      })
    )

    await Promise.all(updatePromises);
    await Promise.all(updateCards);

    res.status(200).json({ message: 'Order saved successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving order' });
    }
};