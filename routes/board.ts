import { Router } from 'express';
import { getBoard, createBoard, updateBoard, deleteBoard } from '../controllers/board';

const router = Router();

router.post('/workspace/:workspace_id/board', createBoard);

router.get('/board/:board_id', getBoard);

router.put('/board/:board_id', updateBoard);

router.delete('/board/:board_id', deleteBoard);

export {router as boardRouter};