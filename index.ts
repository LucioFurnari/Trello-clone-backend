import express from 'express';
import cors from 'cors';
import { index } from './routes/index';
const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use('/api', index.user);

export const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});