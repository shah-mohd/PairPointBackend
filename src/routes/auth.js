const express = require('express');
const {validateSignUpData} = require('../utils/validate');
const bcrypt = require('bcrypt');
const User = require('../model/user');

const authRouter = express.Router();

// signup a user
authRouter.post('/signup', async (req, res) => {
    
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
authRouter.post('/login', async (req, res) => {
    try{
         const {email, password} = req.body;

         const user = await User.findOne({email: email});
         if(!user) {
            throw new Error("Invalid credential!");
         }

         const isValidPassword = await user.validatePassword(password);
         if(isValidPassword){

            //create a  JWT token
            const token = await user.getJWT();

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


module.exports = authRouter;