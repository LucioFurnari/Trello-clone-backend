import express from 'express';
import { createUser, loginUser } from '../controllers/user';
const router = express.Router();

router.post('/user', createUser);

router.get('/user', loginUser);

export const user = router;