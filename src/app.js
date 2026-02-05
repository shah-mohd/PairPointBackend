const express = require('express');
const connectDB = require('./config/database');
const User = require('./model/user');
const {validateSignUpData} = require('./utils/validate');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

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
            res.send("LogIn Successfully!");
         } else{
            throw new Error("Invalid credential!");
         }
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// find a user by email
app.get('/user', async (req, res) => {
    try{
        const emailID = req.body.email;
        const user = await User.findOne({email: emailID});
        if(!user){
            res.status(404).send("User not found!");
        } else {
            res.send(user);
        }
    } catch(err){
        res.status(400).send("Somthing went wrong!" + err.message);
    }
}); 

// show all users
app.get('/feed', async (req, res) => {
    try{
        const users = await User.find();
        res.send(users);
    } catch{
        res.status(400).send("Something went wrong!" + err.message);
    }
});

// delete a user by id
app.delete('/user', async (req, res) => {
    try{
        const userID = req.body.userID;
        const user = await User.findByIdAndDelete({_id: userID});
        res.send("User deleted!");
    } catch(err){
        res.status(400).send("Something went wrong!" + err.message);
    }
});

// update a user by id
app.patch('/user/:userID', async (req, res) => {
    try{
        const userID = req.params?.userID;
        const data = req.body;

        const ALLOWED_UPDATES = ["firstName", "lastName", "age", "gender", "about", "skills", "photoURL"];
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed!");
        }
        if(data?.skills?.length > 10){
            throw new Error("Skills cannot be more than 10!");
        }

        const user = await User.findByIdAndUpdate({_id: userID}, data, {runValidators: true, new: true});
        res.send("User update successfully!");
    } catch(err){
        res.status(400).send("Something went wrong!" + err.message);
    }
});

// update a user by email
app.patch('/user/email', async (req, res) => {
    try{
        const emailID = req.body.email;
        const data = req.body;
        const user = await User.findOneAndUpdate({email: emailID}, data, {runValidators: true});
        res.send("User update successfully!");
    } catch(err){
        res.status(400).send("Something went wrong!" + err.message);
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