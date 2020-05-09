const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    'overall_rating' : {
        type: Number,
        required: true
    }, 
    'bug_rating' : {
        type: Number,
        required: true
    },
    'admin_rating' : {
        type: Number,
        required: true
    }, 
    'location_rating' : {
        type: Number,
        required: true
    }, 
    'title' :{
        type: String,
        required: true
    },
    'comments' : {
        type: String,
        required: true
    }, 
    'listing' : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Listing'
    },
    'contributor' : {
        type: String,
        required: true,
        ref: 'User'
    }
})

const reviewModel = mongoose.model('Review', reviewSchema)

module.exports = reviewModel;