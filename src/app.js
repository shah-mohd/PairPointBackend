const express = require('express');

const app = express();

app.use('/test', (req, res) => {
    res.send('this is a test route');
});

app.use('/hello', (req, res) => {
    res.send('this is hello route');
});

app.listen(3000, () => {
    console.log('App is listening on port 3000.');
});