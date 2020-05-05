const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/rental-ratings', {
    useNewUrlParser: true,
    useCreateIndex: true
})

module.exports = mongoose