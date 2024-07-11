import { Router } from 'express';
import { createUser, loginUser, getUser, verifyToken, logout } from '../controllers/user';
const router = Router();

router.post('/user', createUser);

router.post('/login', loginUser);

router.get('/profile', verifyToken, getUser)

router.post('/logout', logout);

export {router as userRouter};