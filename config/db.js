const mongoose = require('mongoose');
const config = require('./config');

const mongoString = config.mongodb_uri;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database;