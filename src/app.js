const express = require('express');
const connectDB = require('./config/database');
const User = require('./model/user');

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
    // creating a new instance of the User model
    const user = new User(req.body);
    try{
        await user.save();
        res.send(`saved!!!`);
    } catch(err) {
        res.status(400).send("Error saving the user!" + err.message);
    }
});

connectDB().then(() => {
    console.log("Database connected!");
    app.listen(3000, () => {
        console.log('App is listening on port 3000.');
    });
}).catch((err) => {
    console.error("Database can not connect!");
});