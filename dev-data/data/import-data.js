const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {});

const importdata = async () => {
  try {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
    );
    await Tour.create(tours);
  } catch (error) {}
  process.exit();
};

const deletdata = async () => {
  try {
    await Tour.deleteMany();
  } catch (err) {}
  process.exit();
};

if (process.argv[2] === "--delete") {
  deletdata();
}
if (process.argv[2] === "--import") {
  importdata();
}
