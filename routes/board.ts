import express from 'express';
import { getBoard, createBoard, updateBoard } from '../controllers/board';

const router = express.Router();

router.post('/workspace/:workspace_id/board', createBoard);

router.get('/board/:board_id', getBoard);

router.put('/board/:board_id', updateBoard);

export {router as boardRouter};