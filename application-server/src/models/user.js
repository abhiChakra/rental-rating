const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
//const crypto = require('crypto');

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

userSchema.virtual('listings', {
    ref: 'Listing',
    localField: 'username',
    foreignField: 'contributor'
})

userSchema.virtual('reviews', {
    ref: 'Review', 
    localField: 'username',
    foreignField: 'contributor'
})

userSchema.methods.generateToken = async function(){

    let currUser = this

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

userSchema.pre('save', async function(next){
    currUser = this
    
    if(currUser.isModified('password')){
        currUser.password = await bcrypt.hash(currUser.password, 8)
    }

    next()
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel