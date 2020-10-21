const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const User = require('../models/user')
const Listing = require('../models/listing')
const Review = require('../models/review')

const nodemailer = require('nodemailer')
const crypto = require('crypto');

// router for creating/authenticating/updating/deleting user documents

router.get('/', (req, res) => {
    res.status(200).send('Express application running on port ' + process.env.PORT);
})


// endpoint for user login
router.post('/login', async (req, res) => {

    let input_username = req.body.username
    let input_password = req.body.password

    try {
      authenticated_user = await User.authenticateUser(input_username, input_password)

        // JWToken generated for user.
        tokenDetails = await authenticated_user.generateToken()
  
        userCreds = {
            "username" : authenticated_user.username,
            "_id" : authenticated_user._id,
            "currToken" : tokenDetails[1]
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

    // user document created using details passed in with request.
    const newUser = new User({
        'email': user_email,
        'username': user_username, 
        'password': user_password
    })

    try{
        const newCreatedUser = await newUser.save()

        // logging in user upon signup, thus generating JWTToken
        let tokenDetails = await newCreatedUser.generateToken()

        userCreds = {
            'username' : tokenDetails[0].username,
            '_id' : tokenDetails[0]._id,
            'currToken' : tokenDetails[1]
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

// endpoint for logging out users
router.post('/logout', auth, async (req, res) => {
    try {
        let currUser = req.user

        // removing the current token from user profile (for multiple devices)
        currUser.tokens = currUser.tokens.filter(token => token.token != req.token)

        await currUser.save()

        res.status(200).send(JSON.stringify({"response":"Logged out successfully!"}))
    } catch(e){
        console.log(e);
        res.status(500).send(JSON.stringify({'response' : 'Error while logging out!'}))
    }
})

// endpoint for simply verifying whether user is authenticated. 
router.post('/user/is_authenticated', auth, async (req, res) => {
    userInfo = {
        'username' : req.user.username,
        '_id' : req.user._id
    }
    res.status(200).send(JSON.stringify({'response' : userInfo}));
})

// endpoint for password reset. Reset token required.
router.post('/:reset_token/reset', async (req, res) => {
    try{
        let reset_token = req.params.reset_token;

        // finding a user based on reset_token provided in request
        let foundUser = await User.findOne({resetPwdToken : reset_token})

        if(!foundUser){
            res.status(404).send({'response' : 'System error. Could not reset password.'})
        } else if(Date.now() > foundUser.resetPwdExpires){
            // ensuring that the current time is not after the founduser's deadline to resetpwd
            res.status(404).send({'response' : 'Error. Token is invalid or expired.'})
        }else{
            foundUser.password = req.body.newPassword;

            await foundUser.save();

            res.status(200).send({'response' : 'Password Changed!'})
        }
    } catch(error){
        res.status(500).send({'response' : error})
    }
})

// endpoint to handle a forgot pwd request
router.post('/forgot', async (req, res) => {

    try{
        crypto.randomBytes(20, async (err, buf) => {
            if(err){
                console.log(err)
            } else{
                // generating a hex token for pwd reset purpose
                let currPwdToken = buf.toString('hex');

                // user provided an hour deadline to reset pwd
                let relatedUser = await User.findOneAndUpdate({email : req.body.email}, 
                    {resetPwdToken : currPwdToken, resetPwdExpires : Date.now() + 600000})

                    if(!relatedUser){
                        res.status(404).send({'response' : 'Invalid email'})
                    } else{
                        // setting up nodemailer email format to send to user
                        let smtpTransport = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'ratearentalmailer@gmail.com',
                                pass: process.env.MAILER_PWD
                            }
                        })
            
                        let mailOptions = {
                            to: relatedUser.email,
                            from: 'ratearentalmailer@gmail.com',
                            subject: 'RateARental Password Reset',
                            text: 'You are receiving this email because a forgot password was requested on your account.\n'+
                            'Please go to the following link to reset your password: \n\n'+
                            'http://'+process.env.IP+':3000/reset/'+currPwdToken.toString() 
                            + '\n\n'+
                            'Remember to reset within the next hour. If you did not request a password reset, ignore this email.'
                        }
            
                        smtpTransport.sendMail(mailOptions, function(err){
                            console.log('mail sent');
                        })
            
                        res.status(200).send({'response' : 'Mail sent'})
                    }
            }
        })
    } catch(error){
        res.status(500).send({'response' : error})
    }
   
})

// endpoint for deleting user, requires authentication
router.delete('/user/delete_user', auth, async (req, res) => {
    try{
        const userListings = await Listing.find({contributor : req.user.username})

        if(userListings.length > 0){
            // finding listings associated with user
            userListings.map(async listing => {
                // removing reviews of listing
                await Review.deleteMany({listing : listing._id})

                // removing listing
                await Listing.deleteOne({_id : listing._id})
            })
        }
        
        // removing reviews of the user
        await Review.deleteMany({contributor : req.user.username})

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