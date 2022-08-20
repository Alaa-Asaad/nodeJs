const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DataBase Connctions Success');
  });

const importdata = async () => {
  try {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
    );
    await Tour.create(tours);
    console.log('Import Succefully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deletdata = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted Succfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--delete') {
  deletdata();
}
if (process.argv[2] === '--import') {
  importdata();
}
