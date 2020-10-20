const mongoose = require('mongoose')


// Mongoose schema for a rental listing
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

// virtual field of listing reviews
listingSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id', 
    foreignField: 'listing'
})

const listingModel = mongoose.model('Listing', listingSchema)

module.exports = listingModel