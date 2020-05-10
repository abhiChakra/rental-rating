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
        console.log(e)
        res.status(500).send(JSON.stringify({'response' : 'Error adding review. Please check your form.'}))
    }
})

router.get('/:review_id/get_review', auth, async (req, res) => {
    let reviewID = req.params.review_id;


    console.log("Within review_id " + reviewID)
    try{
        let foundReview = await Review.findOne({_id : reviewID})

        console.log(foundReview)

        if(foundReview){
            res.status(200).send(JSON.stringify({'response' : foundReview}))
        } else{
            console.log("reached else")
            res.status(404).send(JSON.stringify({'response' : 'Could not retrieve review details.'}))
        }

    } catch(error){
        console.log("reached error")
        console.log(error)
        res.status(404).send(JSON.stringify({'response' : 'Error fetching this review'}))
    }
})

router.post('/:review_id/update_review', auth, async (req, res) => {
    console.log('foundReview')

    let reviewID = req.params.review_id;
    try{
        const foundReviews = await Review.findOne({ _id : reviewID, contributor : req.user.username})

        console.log(foundReviews)
        console.log(req.body.overall_rating)

        if(foundReviews){
            foundReviews.overall_rating = req.body.overall_rating;
            foundReviews.bug_rating = req.body.bug_rating;
            foundReviews.admin_rating = req.body.admin_rating;
            foundReviews.location_rating = req.body.location_rating;
            foundReviews.title = req.body.title;
            foundReviews.comments = req.body.comments;


            console.log(foundReviews)
            
            await foundReviews.save();
            res.status(200).send(JSON.stringify({'response' : foundReviews}))
        } else{
            res.status(404).send(JSON.stringify({'response' : 'Could not update review. Please verify your entries.'}))
        }
    } catch(error){
        console.log('reached error')
        console.log(error)
        res.status(404).send(JSON.stringify({'response' : 'Error updating review.'}))
    }
})


router.get('/get_reviews', auth, async (req, res) => {
    try{
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