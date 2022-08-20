const fs = require('fs');
const express = require('express');
const e = require('cors');

const app = express();
app.use(express.json());

const port = 3000;

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from Node Js server');
//   res.status(200).json({ message: 'Hello from the server', app: 'Naturos' });
// });
// app.post('/', (req, res) => {
//   res.status(200).send('This for Post things here');
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    statu: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const requestedId = req.params.id;
  console.log(req.params.id * 1);
  const targetTour = tours.find((el) => el.id === +requestedId);

  if (!targetTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invaild ID',
    });
  }

  res.status(200).json({
    statu: 'success',
    data: {
      tours: targetTour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newtour = Object.assign({ id: newId }, req.body);
  tours.push(newtour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.log(err);
      res.status(201).json({
        status: 'success',
        data: {
          tours: newtour,
        },
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on ${port}....`);
});
