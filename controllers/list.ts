import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const createList = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    const { board_id } = req.params;
    const { name } = req.body;

    if(!result.isEmpty()) {
      return res.status(400).json({ errorList: result.array() })
    }

    if(!Number.isNaN(parseInt(board_id))) {
      const list = await prisma.list.create({
        data: {
          name: name,
          boardId: parseInt(board_id),
        }
      });

      return res.status(200).json({ message: 'List created', list});
    }
    return res.status(400).json({ message: 'The board id is not valid', error: true });
  }
]

export async function changePosition(req: Request, res: Response) {
  const { moveTo } = req.body;
  const { board_id, list_id } = req.params;

  const selectedList = await prisma.list.findUnique({
    where: {
      listId: parseInt(list_id)
    }
  })

  console.log(selectedList)
  if (selectedList?.position! > moveTo) {
    const updateMultipleListPosition = prisma.list.updateMany({
      where: {
        boardId: parseInt(board_id),
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
        listId: parseInt(list_id),
      },
      data: {
        position: parseInt(moveTo),
      }
    })
  
    await prisma.$transaction([updateMultipleListPosition, updateListPosition]);
  
    res.status(200).json({ message: 'Updated'})
  } else {
    const updateMultipleListPosition = prisma.list.updateMany({
      where: {
        boardId: parseInt(board_id),
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
        listId: parseInt(list_id),
      },
      data: {
        position: parseInt(moveTo),
      }
    })
  
    await prisma.$transaction([updateMultipleListPosition, updateListPosition]);
  
    res.status(200).json({ message: 'Updated'})
  }
};