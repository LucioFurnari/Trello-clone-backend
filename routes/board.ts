import express from 'express';
import { getBoard } from '../controllers/board';

const router = express.Router();

router.get('/board/:board_id', getBoard);

export {router as boardRouter};