import express from 'express';
import { createUser, loginUser, verifyToken, logout } from '../controllers/user';
const router = express.Router();

router.post('/user', createUser);

router.post('/login', loginUser);

router.post('/session', verifyToken)

router.post('/logout', logout);

export {router as userRouter};