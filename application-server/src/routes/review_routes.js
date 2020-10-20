const express = require('express')
const auth = require('../middleware/auth')
const Review = require('../models/review')

const router = express.Router()

// router for creating/updating/deleting review documents

// endpoint for creating a review. Requires authentication.
router.post('/:listingID/add_review', auth, async (req, res) => {
    let listingID = req.params.listingID;
    
    try{
        // review document created using details passed in through request.
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
        console.log(e)
        res.status(500).send(JSON.stringify({'response' : 'Error adding review. Please check your form.'}))
    }
})

// endpoint for fetching a review based on review id. 
router.post('/:review_id/get_review', auth, async (req, res) => {
    let reviewID = req.params.review_id;

    try{
        let foundReview = await Review.findOne({_id : reviewID})

        if(foundReview){
            res.status(200).send(JSON.stringify({'response' : foundReview}))
        } else{
            res.status(404).send(JSON.stringify({'response' : 'Could not retrieve review details.'}))
        }

    } catch(error){
        console.log(error)
        res.status(404).send(JSON.stringify({'response' : 'Error fetching this review'}))
    }
})

// endpoint for updating a review. Requires authentication.
router.post('/:review_id/update_review', auth, async (req, res) => {
    let reviewID = req.params.review_id;
    try{

        // ensuring review associated with ID was created by the authenticated user.
        const foundReviews = await Review.findOne({ _id : reviewID, contributor : req.user.username})

        if(foundReviews){
            foundReviews.overall_rating = req.body.overall_rating;
            foundReviews.bug_rating = req.body.bug_rating;
            foundReviews.admin_rating = req.body.admin_rating;
            foundReviews.location_rating = req.body.location_rating;
            foundReviews.title = req.body.title;
            foundReviews.comments = req.body.comments;
            
            await foundReviews.save();
            res.status(200).send(JSON.stringify({'response' : foundReviews}))
        } else{
            res.status(404).send(JSON.stringify({'response' : 'Could not update review. Please verify your entries.'}))
        }
    } catch(error){
        console.log(error)
        res.status(404).send(JSON.stringify({'response' : 'Error updating review.'}))
    }
})

// fetching reviews created by an authenticated user.
router.get('/get_reviews', auth, async (req, res) => {
    try{
        // fetching reviews based on username
        const foundReviews = await Review.find({contributor : req.user.username})
        if(foundReviews.length > 0){
            res.status(200).send(JSON.stringify({'response' : foundReviews}))
        } else {
            res.status(500).send(JSON.stringify({'response':'There are no reviews'}))
        }
    } catch (e) {
        res.status(404).send(JSON.stringify({'response':'Error fetching your reviews'}))
    }
})

// endpoint for fetching reviews of a listing. 
router.get('/:listingID/get_reviews', async (req, res) => {

    let listingID = req.params.listingID;

    try{
        const foundReviews = await Review.find({listing: listingID})
        if(foundReviews.length > 0){
            res.status(200).send(JSON.stringify({'response' : foundReviews}))
        } else {
            res.status(500).send(JSON.stringify({'response':'There are no reviews'}))
        }
    } catch (e){
        res.status(404).send(JSON.stringify({'response':'Error fetching your reviews'}))
    }
})

// endpoint for deleting a review. Requires authentication.
router.delete('/delete_review/:reviewID', auth, async (req, res) => {
    let reviewID = req.params.reviewID;
    try{
        // Ensuring review associated with reviewID was created by the authenticated user.
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