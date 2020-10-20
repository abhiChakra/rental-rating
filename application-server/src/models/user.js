const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


// Mongoose schema of a user
const userSchema = new mongoose.Schema({
    'email':{
        type: String,
        unique: true,
        required: true
    },
    'username':{
        type: String, 
        unique: true,
        required: true
    }, 
    'password':{
        type: String, 
        required: true, 
        validate(value){
            if(value.length < 6){
                throw Error('Password must be at least 6 characters')
            }
        }
    },
    resetPwdToken : String, 
    resetPwdExpires : Date,
    'tokens':[{
        token : {
            type: String, 
            required: true
        }
    }]
})

// virtual field of user's listings
userSchema.virtual('listings', {
    ref: 'Listing',
    localField: 'username',
    foreignField: 'contributor'
})

// virtual field of user's reviews
userSchema.virtual('reviews', {
    ref: 'Review', 
    localField: 'username',
    foreignField: 'contributor'
})

// method for generating a JWT token for user during login/signup
userSchema.methods.generateToken = async function(){

    let currUser = this

    // token generated based on token key stored as env variable
    const currToken = jwt.sign({ _id: currUser._id.toString()}, process.env.TOKEN_KEY)

    currUser.tokens = currUser.tokens.concat({'token': currToken})

    const newUser = await currUser.save()

    return [newUser, currToken]
}

// userSchema.methods.generatePwdResetToken = async function(){
//     let currUser = this

//     let currPwdToken = null;

    

//     const newUser = await currUser.updateOne({resetPwdToken : currPwdToken, resetPwdExpires : Date.now() + 600000})

//     return newUser.resetPwdToken
// }

// static method used to authenticate user for login
userSchema.statics.authenticateUser = async (input_username, input_password) => {

        
        let found_user = await userModel.findOne({ username: input_username })

        if(!found_user){
            throw new Error("Unable to login")
        }

        let found_user_password = found_user.password


        let authenticated = await bcrypt.compare(input_password, found_user_password)

        if(!authenticated){
            throw new Error("Unable to login")
        }

        return found_user
}

// a pre-save method applied before saving any user document
userSchema.pre('save', async function(next){
    currUser = this
    
    // prior to saving user document, if password is modified, it is hashed.
    if(currUser.isModified('password')){
        currUser.password = await bcrypt.hash(currUser.password, 8)
    }

    next()
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel