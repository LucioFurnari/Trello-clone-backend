import { body, validationResult } from "express-validator";
import express from 'express';

export const createWorkSpace = [
  body('name').trim().notEmpty(),
  async (req: express.Request, res: express.Response) => { 
    const result = validationResult(req);

    if (result.isEmpty()) {
      return res.status(200).json({ message: 'WorkSpace created'})
    }

    return res.status(400).json({ error: true, errorList: result });
  }
];

export async function getWorkSpace(_req: express.Request, _res: express.Response) {
  // Do a request with the id of the workspace ( request.workspace_id)
}

export async function getAllWorkSpaces() {
  
}