const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const User = require('../models/user')
const Listing = require('../models/listing')
const Review = require('../models/review')


router.get('/', (req, res) => {
    res.status(200).send('Express application running!')
})


// login
router.post('/login', async (req, res) => {

    let input_username = req.body.username
    let input_password = req.body.password

    try {
      authenticated_user = await User.authenticateUser(input_username, input_password)

        tokenDetails = await authenticated_user.generateToken()

        res.cookie('token', tokenDetails[1], {httpOnly : true})
  
        userCreds = {
            "username" : authenticated_user.username,
            "_id" : authenticated_user._id
        }
  
        res.status(200).send(JSON.stringify(userCreds));

    } catch(e){
        res.status(500).send(JSON.stringify({'response': 'Incorrect credentials'}))
    }
})

// creating a user
router.post('/create_user', async (req, res) => {
    let user_email = req.body.email;
    let user_username = req.body.username;
    let user_password = req.body.password;

    const newUser = new User({
        'email': user_email,
        'username': user_username, 
        'password': user_password
    })

    try{
        const newCreatedUser = await newUser.save()

        let tokenDetails = await newCreatedUser.generateToken()

        res.cookie('token', tokenDetails[1], {httpOnly : true})

        userCreds = {
            'username' : tokenDetails[0].username,
            '_id' : tokenDetails[0]._id
        }
        res.status(200).send(JSON.stringify(userCreds))
    }catch(e){
        res.status(500).send({'response' : e})
    }
})

router.get('/users/me', auth, async (req, res) => {
    try{
        res.status(200).send(req.user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.get('/logout', auth, async (req, res) => {
    try {
        let currUser = req.user

        currUser.tokens = currUser.tokens.filter(token => token.token != req.token)

        await currUser.save()

        res.clearCookie('token');

        res.status(200).send(JSON.stringify({"response":"Logged out successfully!"}))
    } catch(e){
        console.log(e);
        res.status(500).send(JSON.stringify({'response' : 'Error while logging out!'}))
    }
})

router.get('/user/is_authenticated', auth, async (req, res) => {
    userInfo = {
        'username' : req.user.username,
        '_id' : req.user._id
    }
    res.status(200).send(JSON.stringify({'response' : userInfo}));
})

router.delete('/user/delete_user', auth, async (req, res) => {
    try{
        await Review.deleteMany({contributor : req.user.username})
        await Listing.deleteMany({contributor : req.user.username})

        const deletedUser = await User.deleteOne({_id: req.user._id})

        if(deletedUser){
            res.status(200).send(JSON.stringify({'response' : 'Deleted user successfully'}))
        } else{
            res.status(404).send(JSON.stringify({'response' : 'Could not delete user'}))
        }
    } catch(error){
        console.log(error)
        res.status(404).send(JSON.stringify({'response' : 'Error while deleting user'}))
    }
})

module.exports = router