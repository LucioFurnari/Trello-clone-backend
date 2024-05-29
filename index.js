const express = require('express');
const app = express();
const PORT = process.env.PORT;
const router = require('./routes/index');

console.log(PORT)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router.user);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});