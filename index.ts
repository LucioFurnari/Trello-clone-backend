import express from 'express';
import { index } from './routes/index.js';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api', index.user);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});