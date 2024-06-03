import express from 'express';
import { createUser, getUser } from '../controllers/user';
const router = express.Router();

router.post('/user', createUser);

router.get('/user', getUser);

export const user = router;