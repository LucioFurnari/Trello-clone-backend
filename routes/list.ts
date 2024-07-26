import { Router } from "express";
import { createList, changePosition, deleteList } from "../controllers/list";

const router = Router();

router.post('/board/:boardId/list', createList);

router.put('/board/:boardId/list/:listId', changePosition);

router.delete('/list/:listId', deleteList);

export { router as listRouter }