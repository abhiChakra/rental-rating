const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const User = require('../models/user')


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
        res.status(500).send(e)
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
        res.status(500).send(e)
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
        res.status(500).send(e)
    }
})

router.get('/user/is_authenticated', auth, async (req, res) => {
    userInfo = {
        'username' : req.user.username,
        '_id' : req.user._id
    }
    res.status(200).send(JSON.stringify({'response' : userInfo}));
})


router.get('/user/profile/:username', auth, async (req, res) => {
    res.send(JSON.stringify({"response":"Welcome to your homepage " + req.user.username.toString()}))
})


// fetching all users
router.get('/users', async (req, res) => {
    try{
        let found_users = await User.find({})
        res.status(200).send(found_users)
    }catch(e){
        res.status(500).send(e)
    }
})

// updating a username
router.patch('/update_user', async (req, res) => {

    username_lookup = req.body.username;

    username_password = req.body.password;

    try{
        const foundUser = await User.findOne({username: username_lookup})
        
        if(!foundUser){
            res.status(400).send("Could not find such a user")
        }

        foundUser.password = username_password;

        await foundUser.save()

        res.status(200).send(foundUser)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports = router