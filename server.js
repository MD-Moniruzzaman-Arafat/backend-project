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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Sea Explorer',
  rating: 5.7,
  price: 300,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
