import { Router } from "express";
import { createList, changePosition } from "../controllers/list";

const router = Router();

router.post('/board/:board_id/list', createList);

router.put('/board/:board_id/list/:list_id', changePosition)

export { router as listRouter }