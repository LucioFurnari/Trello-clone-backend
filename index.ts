import express from 'express';
import cors from 'cors';
import { index } from './routes/index';
const app = express();
const PORT = process.env.PORT;
const { userRouter, workspaceRouter, boardRouter, listRouter } = index;

app.use(cors());

app.use(express.json());
app.use('/api', userRouter, workspaceRouter, boardRouter, listRouter);

export const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});