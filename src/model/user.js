const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        lowecase: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address!" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password!" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error("Gender data is not valid!");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about to the user"
    },
    skills: {
        type: [String]
    },
    photoURL: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL!" + value)
            }
        }
    }
},{
    timestamps: true
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@PairPoint", {expiresIn: "7d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isValidPassword;
}

const User = mongoose.model("User", userSchema);

module.exports = User;