import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const createList = [
  body('name').notEmpty().trim().escape(),
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
