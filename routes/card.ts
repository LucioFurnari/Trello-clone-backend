import { Router } from "express";
import { createCard, deleteCard, updateCard, getCard } from "../controllers/card";
const router = Router();

router.post('/list/:listId/card', createCard);

router.delete('/card/:cardId', deleteCard);

router.put('/card/:cardId', updateCard);

router.get('/card/:cardId', getCard);

export {router as cardRouter};