const express = require('express')
const auth = require('../middleware/auth')
const Listing = require('../models/listing')

const router = express.Router()

router.post('/create_listing', auth, async (req, res) => {

    const listing = new Listing({
        ...req.body,
        contributor: req.user.username
    })

    try{
        await listing.save()
        res.status(200).send(JSON.stringify({'response' : 'Added new listing!'}))
    } catch (e) {
        res.status(404).send(JSON.stringify({'response' : 'Error creating listing.'}))
    }
})

router.get('/get_listings', auth, async (req, res) => {
    try{
        const foundListing = await Listing.find({ contributor : req.user.username})
        if(foundListing){
            res.status(200).send(JSON.stringify({'response' : foundListing}))
        } else{
            res.status(500).send(JSON.stringify({'response':'There are no listings'}))
        }
    } catch (e){
        res.status(404).send(JSON.stringify({'response':'Error fetching listings'}))
    }
})

router.get('/get_listing_query', async (req, res) => {
    let currHouseNum = req.query.number;
    let currStreet = req.query.street;
    let city = req.query.city;
    let province = req.query.province;
    let country = req.query.country;
    
    try{
        const currListing = await Listing.find({number : currHouseNum, 
                                             street : currStreet,
                                             city: city,
                                             province : province,
                                             country : country
                                          })
        if(currListing){
            res.status(200).send(JSON.stringify({'response' : currListing}))
        } else{
            res.status(404).send(JSON.stringify({'response' : 'Could not find a listing. Please consider logging in and creating a listing.'}))
        }
    } catch (error){
        console.log(error)
    }
})

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
        console.log(error)
    }

})

router.delete('/delete_listing', auth, async (req, res) => {

    let listingDeleteId = req.body.taskID;

    try{
        const foundListing = await Listing.deleteOne({ _id : taskDeleteId})
        
        if(foundListing){
            res.status(200).send(JSON.stringify({'response' : 'Deleted successfully'}))
        } else{
            res.status(500).send(JSON.stringify({'reponse' : 'Could not delete listing'}))
        }
    } catch (e) {
        res.status(404).send(JSON.stringify({'response' : 'Error deleting listing'}))
    }
})


module.exports = router