const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./Utils/appError");
const golbalErrorHandler = require("./controllers/errorController");

const tourRoute = require("./routes/toursRoute");
const userRoute = require("./routes/usersRoute");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

//MIDDLEWARE
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// app.use((req, res, next) => {
//   console.log('THis is MiddleWare');
//   next();
// });

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', greateTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//Routes

app.use("/api/v1/users", userRoute);
app.use("/api/v1/tours", tourRoute);

//Here the order of middleware is very important if this put at the first all routes handle by this one
app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find the url ${req.originalUrl}`, 404);
  next(err);
});

app.use(golbalErrorHandler);
module.exports = app;
