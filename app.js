const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello From the Server Side', app: 'natours' });
});
app.post('/', (req, res) => {
  res.send('you can post to this endpoint');
});
app.listen(port, () => {
  console.log('App Running on Port 3000');
});
