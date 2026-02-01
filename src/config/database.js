const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://shahmohammadt01:AON8VsT7YZQDMfgF@shah07.seotoyt.mongodb.net/PairPoint");
}   

module.exports = connectDB;