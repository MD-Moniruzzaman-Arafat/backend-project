require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`✅ MongoDB Connect: ${conn.connection.host}`);
  } catch (err) {
    console.log(`❌ MongoDB Not Connect: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
