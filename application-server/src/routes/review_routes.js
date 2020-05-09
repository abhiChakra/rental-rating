const express = require('express')
const auth = require('../middleware/auth')
const Review = require('../models/review')

const router = express.Router()

router.post('/:listingID/add_review', auth, async (req, res) => {
    let listingID = req.params.listingID;
    
    try{
        const review = new Review({
            overall_rating: req.body.overall_rating,
            bug_rating: req.body.bug_rating,
            admin_rating: req.body.admin_rating,
            location_rating: req.body.location_rating,
            title: req.body.title,
            comments: req.body.comments,
            listing: listingID,
            contributor: req.user.username
        })
        await review.save()
        res.status(200).send(JSON.stringify({'response' : review}))
    } catch (e) {
        console.log("reached error")
        console.log(e)
        res.status(500).send(JSON.stringify({'response' : e}))
    }
})

router.get('/get_reviews', auth, async (req, res) => {
    try{
        const foundReviews = await Review.find({contributor : req.user.username})
        if(foundReviews){
            res.status(200).send(JSON.stringify({'response' : foundReviews}))
        } else {
            res.status(500).send(JSON.stringify({'response':'There are no reviews'}))
        }
    } catch (e) {
        res.status(404).send(JSON.stringify({'response':'Error fetching your reviews'}))
    }
})

router.get('/:listingID/get_reviews', async (req, res) => {

    let listingID = req.params.listingID;

    try{
        const foundReviews = await Review.find({listing: listingID})
        if(foundReviews){
            res.status(200).send(JSON.stringify({'response' : foundReviews}))
        } else {
            res.status(500).send(JSON.stringify({'response':'There are no reviews'}))
        }
    } catch (e){
        res.status(404).send(JSON.stringify({'response':'Error fetching your reviews'}))
    }
})

router.delete('/delete_review/:reviewID', auth, async (req, res) => {
    let reviewID = req.params.reviewID;
    try{
        const foundReview = await Review.deleteOne({_id : reviewID, contributor : req.user.username})

        if(foundReview){
            res.status(200).send(JSON.stringify({'response' : 'Deleted successfully'}))
        } else{
            res.status(500).send(JSON.stringify({'reponse' : 'Could not delete listing'}))
        }
    } catch(e) {
        res.status(404).send(JSON.stringify({'response' : 'Error deleting listing'}))
    }
})

module.exports = router