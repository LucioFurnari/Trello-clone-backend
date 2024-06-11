import express from 'express';
import { verifyToken } from '../controllers/user';
import { createWorkSpace, getWorkSpace, updateWorkspace, deleteWorkSpace } from '../controllers/workspace';

const router = express.Router();

router.get('/workspace/:workspace_id', getWorkSpace);

router.post('/workspace', verifyToken, createWorkSpace);

router.put('/workspace/:workspace_id', updateWorkspace);

router.delete('/workspace/:workspace_id', deleteWorkSpace)

export {router as workspaceRouter}