import { Router } from "express";
import { createList, updatePosition, deleteList } from "../controllers/list";

const router = Router();

router.post('/board/:boardId/list', createList);

router.put('/list', updatePosition);

router.delete('/board/:boardId/list/:listId', deleteList);

export { router as listRouter }