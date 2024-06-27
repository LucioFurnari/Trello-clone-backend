import { Router } from 'express';
import { getBoard, createBoard, updateBoard, deleteBoard } from '../controllers/board';

const router = Router();

router.post('/workspace/:workspaceId/board', createBoard);

router.get('/board/:boardId', getBoard);

router.put('/board/:boardId', updateBoard);

router.delete('/board/:boardId', deleteBoard);

export {router as boardRouter};