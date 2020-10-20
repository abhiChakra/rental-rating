// Setting up Mongoose connection to MongoDB hosted at MongoDB Atlas
const mongoose = require('mongoose')
require('dotenv').config()

// Referencing env variable
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

module.exports = mongoose