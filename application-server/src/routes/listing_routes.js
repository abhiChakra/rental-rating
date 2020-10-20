const express = require('express')
const auth = require('../middleware/auth')
const Listing = require('../models/listing')
const Review = require('../models/review')

const router = express.Router()


// router for creating/modifying listings

// post call for creating a listing. Requires authentication.
router.post('/create_listing', auth, async (req, res) => {
    try{
            
            // ensuring single listing is not created twice
            const currListing = await Listing.find({number : req.body.number, 
                                                 street : req.body.street,
                                                 city: req.body.city,
                                                 province : req.body.province,
                                                 country : req.body.country
                                              })
            if(currListing.length > 0){
                return res.status(404).send(JSON.stringify({'response' : 'This listing already exists.'}))
            } 
            
            // creating listing based on listing details passed in through request
            const listing = new Listing({
                ...req.body,
                contributor: req.user.username
            })
        
            await listing.save()
            res.status(200).send(JSON.stringify({'response' : 'Added new listing!'}))

        } catch (e) {
            res.status(404).send(JSON.stringify({'response' : 'Error saving form. Please recheck your input address.'}))
        }
})

// fetchting a user's listings. POST call for passing in user token for authentication.
router.post('/get_listings', auth, async (req, res) => {
    try{
        // fetching listings based on document contributor (username)
        const foundListing = await Listing.find({ contributor : req.user.username})
        if(foundListing.length > 0){
            res.status(200).send(JSON.stringify({'response' : foundListing}))
        } else {
            res.status(500).send(JSON.stringify({'response':'There are no listings'}))
        }
    } catch (e){
        res.status(404).send(JSON.stringify({'response':'Error fetching listings'}))
    }
})

// fetching details of a listing. Does not require authentication.
router.get('/get_listing_query', async (req, res) => {
    let currHouseNum = req.query.number;
    let currStreet = req.query.street;
    let city = req.query.city;
    let province = req.query.province;
    let country = req.query.country;
    
    try{
        // finding listing based on listing details passed in through request call
        const currListing = await Listing.find({number : currHouseNum, 
                                             street : currStreet,
                                             city: city,
                                             province : province,
                                             country : country
                                          })
        if(currListing.length > 0){
            res.status(200).send(JSON.stringify({'response' : currListing}))
        } else{
            res.status(404).send(JSON.stringify({'response' : 'Could not find a listing for this address. Please consider logging in and creating a listing.'}))
        }
    } catch (error){
        console.log(error)
    }
})

// Fetching a listing based on listing ID. Does not require authentication.
router.get('/get_listing/:id', async (req, res) => {

    let listingID = req.params.id;

    try{
        const foundListing = await Listing.findOne({ _id : listingID})
        
        if(!foundListing){
            res.status(404).send(JSON.stringify({'response' : 'Could not find listing'}))
        } else{
            res.status(200).send(JSON.stringify({"response" : foundListing}))
        }
    } catch (error){
        res.status(500).send(JSON.stringify({'response' : "Error fetching details for this listing"}))
    }

})

// router for deleting a listing based on listing ID. Requires authentication.
router.delete('/delete_listing/:listingID', auth, async (req, res) => {

    let listingDeleteID = req.params.listingID;

    try{
        // finding listing based on listing id and ensuring listing contributor is authenticated user
        const findListing = await Listing.findOne({ _id : listingDeleteID, contributor : req.user.username})
        
        // upon finding listing, deleting review documents associated with listing.
        await Review.deleteMany({ listing : findListing._id })

        // deleting listing document
        const deletedListing = await Listing.deleteOne({ _id : findListing._id})
        
        if(deletedListing){
            res.status(200).send(JSON.stringify({'response' : 'Deleted successfully'}))
        } else{
            res.status(500).send(JSON.stringify({'reponse' : 'Could not delete listing'}))
        }
    } catch (e) {
        res.status(404).send(JSON.stringify({'response' : 'Error deleting listing'}))
    }
})


module.exports = router