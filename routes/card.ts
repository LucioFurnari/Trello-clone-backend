import { Router } from "express";
import { verifyToken } from "../controllers/user";
import { createCard, deleteCard, updateCard, getCard, getUserCards } from "../controllers/card";
const router = Router();

router.post('/list/:listId/card', createCard);

router.delete('/card/:cardId', deleteCard);

router.put('/card/:cardId', updateCard);

router.get('/card/:cardId', getCard);

router.get('/cards', verifyToken, getUserCards)

export {router as cardRouter};