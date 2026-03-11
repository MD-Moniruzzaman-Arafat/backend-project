require('dotenv').config();
const app = require('./app');

console.log(process.env.NODE_ENV);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
