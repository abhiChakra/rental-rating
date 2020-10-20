const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()


// auth used for verifying user is authenticated by evaluating request token
const auth = async (req, res, next) => {

    const token = req.body.currUserToken;

    if(!token){
        res.status(401).send(JSON.stringify({'response':'Unauthorized: No token provided'}))
    } else{
        try{
            // token evaluated based on token key stored as env variable
            const decodedId = jwt.verify(token, process.env.TOKEN_KEY)
            const user = await User.findOne({ _id: decodedId, 'tokens.token':token})
    
            if(!user){
                res.status(401).send(JSON.stringify({'response':'Unauthorized: Could not find user.'}))
            }
    
            req.token = token
            req.user = user
            next()
    
        } catch(e){
            throw new Error("Could not authenticate")
        }
    }
}


module.exports = auth

