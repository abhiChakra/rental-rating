const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const User = require('../models/user')
const Listing = require('../models/listing')
const Review = require('../models/review')

const nodemailer = require('nodemailer')
const crypto = require('crypto');


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

        //res.cookie('token', tokenDetails[1], {httpOnly : true})
  
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

    const newUser = new User({
        'email': user_email,
        'username': user_username, 
        'password': user_password
    })

    try{
        const newCreatedUser = await newUser.save()

        let tokenDetails = await newCreatedUser.generateToken()

        //res.cookie('token', tokenDetails[1], {httpOnly : true})

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

router.post('/logout', auth, async (req, res) => {
    try {
        let currUser = req.user

        currUser.tokens = currUser.tokens.filter(token => token.token != req.token)

        await currUser.save()

        //res.clearCookie('token');

        res.status(200).send(JSON.stringify({"response":"Logged out successfully!"}))
    } catch(e){
        console.log(e);
        res.status(500).send(JSON.stringify({'response' : 'Error while logging out!'}))
    }
})

router.post('/user/is_authenticated', auth, async (req, res) => {
    userInfo = {
        'username' : req.user.username,
        '_id' : req.user._id
    }
    res.status(200).send(JSON.stringify({'response' : userInfo}));
})

router.post('/:reset_token/reset', async (req, res) => {
    try{
        let reset_token = req.params.reset_token;
        let foundUser = await User.findOne({resetPwdToken : reset_token})

        if(!foundUser){
            res.status(404).send({'response' : 'System error. Could not reset password.'})
        } else if(Date.now() > foundUser.resetPwdExpires){
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

router.post('/forgot', async (req, res) => {

    try{
        crypto.randomBytes(20, async (err, buf) => {
            if(err){
                console.log(err)
            } else{
                let currPwdToken = buf.toString('hex');
                let relatedUser = await User.findOneAndUpdate({email : req.body.email}, 
                    {resetPwdToken : currPwdToken, resetPwdExpires : Date.now() + 600000})

                    if(!relatedUser){
                        res.status(404).send({'response' : 'Invalid email'})
                    } else{
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

router.delete('/user/delete_user', auth, async (req, res) => {
    try{
        const userListings = await Listing.find({contributor : req.user.username})

        if(userListings.length > 0){
            userListings.map(async listing => {
                await Review.deleteMany({listing : listing._id})
                await Listing.deleteOne({_id : listing._id})
            })
        }
        
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