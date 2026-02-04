const mongoose = require('mongoose');
const mongoURL = require('./mongoURL');

const connectDB = async () => {
    await mongoose.connect(mongoURL);
}   

module.exports = connectDB;