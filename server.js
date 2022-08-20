// eslint-disable-next-line import/newline-after-import
const mongoose = require("mongoose");

// eslint-disable-next-line import/newline-after-import

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

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
  .then(() => {
    console.log("DataBase Connctions Success");
  });

//Server Start
const port = process.env.PORT || 3000;
// app.use(cors());
const server = app.listen(port, () => {
  console.log(`Server is Running on ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
