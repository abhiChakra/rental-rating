const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {

    const token = req.cookies.token

    if(!token){
        res.status(404).send(JSON.stringify({'response':'Unauthorized: No token provided'}))
    } else{
        try{
            //const token = req.header('Authorization').replace('Bearer ', '')
            const decodedId = jwt.verify(token, TOKEN_KEY)
            const user = await User.findOne({ _id: decodedId, 'tokens.token':token})
    
            if(!user){
                res.status(404).send(JSON.stringify({'response':'Unauthorized: Could not find user.'}))
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

