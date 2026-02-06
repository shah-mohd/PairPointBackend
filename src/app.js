const express = require('express');
const connectDB = require('./config/database');
const User = require('./model/user');
const {validateSignUpData} = require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

// signup a user
app.post('/signup', async (req, res) => {
    
    try{
        // validation of data
        validateSignUpData(req);

        const {firstName, lastName, email, password} = req.body;

        // bcrypt password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.send("saved!");
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// log in a user
app.post('/login', async (req, res) => {
    try{
         const {email, password} = req.body;

         const user = await User.findOne({email: email});
         if(!user) {
            throw new Error("Invalid credential!");
         }

         const isValidPassword = await bcrypt.compare(password, user.password);
         if(isValidPassword){

            //create a  JWT token
            const token = await jwt.sign({_id: user._id}, "DEV@PairPoint", {expiresIn: "7d"});

            //add the token to cookie and send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});

            res.send("LogIn Successfully!");
         } else{
            throw new Error("Invalid credential!");
         }
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// get profile data
app.get('/profile', userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user.firstName + " send request.");

    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
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