const fs = require('fs').promises;
const express = require('express');
const app = express();
const port = 3000;

// middleware
app.use(express.json());

// custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

async function readMyFile() {
  try {
    const data = await fs.readFile(`${__dirname}/data/data.json`, 'utf8');
    return data;
  } catch (error) {
    console.log(error.message);
  }
}
app.get('/api/v1/tours', async (req, res) => {
  const time = req.requestTime;
  console.log(time);
  const result = await readMyFile();
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: JSON.parse(result).length,
    data: {
      tours: JSON.parse(result),
    },
  });
});

app.post('/api/v1/tours', async (req, res) => {
  const body = req.body;
  console.log(body);
  res.send('Done');
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hi This Is My Project' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
