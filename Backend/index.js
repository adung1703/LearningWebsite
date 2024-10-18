const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config();

const loginRoute = require('./routes/login.js');

const port = process.env.PORT;
const DB_URI = process.env.DB_URI;

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

app.use('/login', loginRoute);

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
})