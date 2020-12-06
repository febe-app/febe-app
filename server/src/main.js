const express = require('express');
const cors = require('cors');
const collectionRoutes = require('./routes/collections.js');
const dataRoutes = require('./routes/data.js');

const port = process.env.PORT || 3030;

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server started successfully`);
});
