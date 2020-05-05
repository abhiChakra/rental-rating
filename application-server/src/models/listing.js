const mongoose = require('mongoose')

const listingSchema = mongoose.Schema({
    'number':{
        type: Number,
        required: true
    }, 
    'street':{
        type: String, 
        required: true
    },
    'city':{
        type: String, 
        required: true
    },
    'province':{
        type: String,
        required: true
    },
    'country':{
        type: String,
        required: true
    },
    'contributor':{
        type: String,
        required: true,
        ref: 'User'
    }
})

const listingModel = mongoose.model('Listing', listingSchema)

module.exports = listingModel