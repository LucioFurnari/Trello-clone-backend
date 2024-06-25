import { Router } from 'express';
import { verifyToken } from '../controllers/user';
import { createWorkSpace, getWorkSpace, getAllWorkSpaces, updateWorkspace, deleteWorkSpace } from '../controllers/workspace';

const router = Router();

router.get('/workspace/:workspace_id', verifyToken, getWorkSpace);

router.get('/workspace', verifyToken, getAllWorkSpaces)

router.post('/workspace', verifyToken, createWorkSpace);

router.put('/workspace/:workspace_id', updateWorkspace);

router.delete('/workspace/:workspace_id', deleteWorkSpace)

export {router as workspaceRouter}