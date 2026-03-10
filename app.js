const fs = require('fs').promises;
const express = require('express');
const app = express();
const port = 3000;

async function readMyFile() {
  try {
    const data = await fs.readFile(`${__dirname}/data/data.json`, 'utf8');
    return data;
  } catch (error) {
    console.log(error.message);
  }
}
app.get('/api/v1/tours', async (req, res) => {
  const result = await readMyFile();
  res.status(200).json({
    status: 'success',
    results: JSON.parse(result).length,
    data: {
      tours: JSON.parse(result),
    },
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hi This Is My Project' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
