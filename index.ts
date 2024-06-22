import express from 'express';
import cors from 'cors';
import { index } from './routes/index';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT;
const { userRouter, workspaceRouter, boardRouter, listRouter, memberRouter } = index;

app.use(cors());

app.use(express.json());
app.use(cookieParser())
app.use('/api', userRouter, workspaceRouter, boardRouter, listRouter, memberRouter);

export const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});