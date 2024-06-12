import { Router } from "express";
import { createList } from "../controllers/list";

const router = Router();

router.post('/board/:board_id/list', createList);

export { router as listRouter }