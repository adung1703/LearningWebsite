const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes.js');
const courseRoutes = require('./routes/courseRoutes.js');

const DB_URI = 'mongodb+srv://adung1703:Adung_2003@cluster0.klijv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mongoose = require("mongoose");

mongoose
  .connect(DB_URI, null)
  .then(() => {
    console.log("MongoDB connection successful...");
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err.message);
  })

const app = express();

app.use(express.static(path.join(__dirname)));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/course', courseRoutes);

require('dotenv').config();
const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});