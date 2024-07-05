import { Router } from "express";
import { createList, changePosition } from "../controllers/list";

const router = Router();

router.post('/board/:boardId/list', createList);

router.put('/board/:boardId/list/:listId', changePosition)

export { router as listRouter }