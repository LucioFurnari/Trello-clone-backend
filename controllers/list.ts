import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import { body, validationResult } from "express-validator";
import { NewListEntry } from "../interfaces";
import { List } from "@prisma/client";


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
      const list = await prisma.list.create({
        data: {
          name: name,
          boardId: parseInt(boardId),
        }
      });

      return res.status(200).json({ message: 'List created', list});
    }
    return res.status(400).json({ message: 'The board id is not valid', error: true });
  }
]

export async function deleteList(req: Request, res: Response) {
  const { listId } = req.params;

  try {
    if(!Number.isNaN(parseInt(listId))) {
      const list = await prisma.list.delete({
        where: {
          listId: parseInt(listId),
        },
      });

      return res.status(200).json({ message: 'List deleted', list})
    }

    return res.status(400).json({ message: 'The list id is not valid', error: true });
  } catch (error) {
    console.error('Error deleting list:', error);
    return res.status(500).json({ message: 'Internal server error', error: true });
  }
}

export async function changePosition(req: Request, res: Response) {
  const { moveTo } = req.body;
  const { boardId, listId } = req.params;

  const selectedList = await prisma.list.findUnique({
    where: {
      listId: parseInt(listId)
    }
  })

  if (!selectedList) {
    return res.status(404).json({ message: 'List not found'})
  }

  if (selectedList?.position! > moveTo) {
    try {
      await moveLeft(boardId, listId, moveTo, selectedList);
      return res.status(200).json({ message: 'Updated'})
    } catch (error) {
      
    }

  } else {
    
    try {
      await moveRight(boardId, listId, moveTo, selectedList)
      return res.status(200).json({ message: 'Updated'})
    } catch (error) {
      
    }
  }
};


async function moveLeft(boardId: string, listId: string, moveTo: number, selectedList: List) {
  const updateMultipleListPosition = prisma.list.updateMany({
    where: {
      boardId: parseInt(boardId),
      AND: [
        {
          position: {
            gte: moveTo,
          },
        },
        {
          position: {
            lt: selectedList?.position,
          }
        }
      ]
    },
    data: {
      position: {
        increment: 1
      }
    }
  })

  const updateListPosition =  prisma.list.update({
    where: {
      listId: parseInt(listId),
    },
    data: {
      position: moveTo,
    }
  })

  await prisma.$transaction([updateMultipleListPosition, updateListPosition]);
}

async function moveRight(boardId: string, listId: string, moveTo: number, selectedList: List) {
  const updateMultipleListPosition = prisma.list.updateMany({
    where: {
      boardId: parseInt(boardId),
      AND: [
        {
          position: {
            gt: selectedList?.position,
          },
        },
        {
          position: {
            lte: moveTo,
          }
        }
      ]
    },
    data: {
      position: {
        decrement: 1
      }
    }
  })

  const updateListPosition =  prisma.list.update({
    where: {
      listId: parseInt(listId),
    },
    data: {
      position: moveTo,
    }
  })

  await prisma.$transaction([updateMultipleListPosition, updateListPosition]);
}
