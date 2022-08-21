// eslint-disable-next-line import/newline-after-import
const mongoose = require("mongoose");

// eslint-disable-next-line import/newline-after-import

process.on("uncaughtException", (err) => {
  console.log(err);
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
  .then(() => {});

//Server Start
const port = process.env.PORT || 3000;
// app.use(cors());
const server = app.listen(port, () => {
  console.log("Hello there Im eng Alaa Asaad");
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
