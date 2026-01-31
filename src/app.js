const express = require('express');
const {adminAuth, userAuth} = require('./middlewares/auth');

const app = express();

app.use('/admin', adminAuth);

app.get('/user/login', (req, res) => {
    res.send("Login user");
});

app.get('/user/profile', userAuth, (req, res) => {
    res.send("Show Profile");
});

app.get('/admin/allData', (req, res) => {
    res.send("send all data");
});

app.get('/admin/allDelete', (req, res) => {
    res.send("deleted");
});


app.listen(3000, () => {
    console.log('App is listening on port 3000.');
});