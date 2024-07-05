import { Router } from 'express';
import { verifyToken } from '../controllers/user';
import { createWorkSpace, getWorkSpace, getAllWorkSpaces, updateWorkspace, deleteWorkSpace } from '../controllers/workspace';

const router = Router();

router.get('/workspace/:workspaceId', verifyToken, getWorkSpace);

router.get('/workspace', verifyToken, getAllWorkSpaces)

router.post('/workspace', verifyToken, createWorkSpace);

router.put('/workspace/:workspaceId', updateWorkspace);

router.delete('/workspace/:workspaceId', deleteWorkSpace)

export {router as workspaceRouter}