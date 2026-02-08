const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const request = require('./routes/request');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', request);


connectDB().then(() => {
    console.log("Database connected!");
    app.listen(3000, () => {
        console.log('App is listening on port 3000.');
    });
}).catch((err) => {
    console.error("Database can not connect!");
});