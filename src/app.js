const express = require('express');
const connectDB = require('./config/database');

const app = express();

connectDB().then(() => {
    console.log("Database connected!");
    app.listen(3000, () => {
        console.log('App is listening on port 3000.');
    });
}).catch((err) => {
    console.error("Database can not connect!");
});