import { Router } from "express";
import { createCard } from "../controllers/card";
const router = Router();

router.post('/list/:listId/card', createCard);

export {router as cardRouter};