const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// import route
const userRoutes = require('./routes/UserRoute.js');

const app = express();
const PORT = process.env.PORT;

const mongoDBURL = process.env.MONGODB_URI;

mongoose
  .connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection Successful'))
  .catch((error) => console.error('Connection Error: ' + error));

app.use(express.json());
app.use(cors());
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
