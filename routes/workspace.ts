import express from 'express';
import { verifyToken } from '../controllers/user';
import { createWorkSpace, getWorkSpace } from '../controllers/workspace';

const router = express.Router();

router.get('/workspace/:workspace_id', getWorkSpace);

router.post('/workspace', verifyToken, createWorkSpace);

export {router as workspaceRouter}