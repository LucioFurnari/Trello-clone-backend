import express from 'express';
import { createUser, loginUser, verifyToken } from '../controllers/user';
const router = express.Router();

router.post('/user', createUser);

router.post('/login', loginUser);

router.post('/session', verifyToken)
export const user = router;