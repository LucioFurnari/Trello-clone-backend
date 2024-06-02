import express from 'express';
import { createWorkSpace, getWorkSpace } from '../controllers/workspace';

const router = express.Router();

router.get('/workspace/:workspace_id', getWorkSpace);

router.post('/workspace', createWorkSpace);

export = router;