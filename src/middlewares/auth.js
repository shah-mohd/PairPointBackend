const jwt = require('jsonwebtoken');
const User = require('../model/user');

const userAuth = async (req, res, next) => {
    try{
        // read the token from the req cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid token!");
        }
        // validate the token
        const decode = await jwt.verify(token, "DEV@PairPoint");
        const {_id} = decode;
        // find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User data does not exits!");
        }
        req.user = user;
        next();
    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
    
}

module.exports = {userAuth};