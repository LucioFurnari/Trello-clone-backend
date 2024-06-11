import express from 'express';
import { getBoard, createBoard } from '../controllers/board';

const router = express.Router();

router.post('/workspace/:workspace_id/board', createBoard);

router.get('/board/:board_id', getBoard);

export {router as boardRouter};