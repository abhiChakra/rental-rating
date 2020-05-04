const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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
    'tokens':[{
        token : {
            type: String, 
            required: true
        }
    }]
})

userSchema.methods.generateToken = async function(){

    const currUser = this

    const currToken = jwt.sign({ _id: currUser._id.toString()}, process.env.TOKEN_KEY)

    currUser.tokens = currUser.tokens.concat({'token': currToken})

    const newUser = await currUser.save()

    return [newUser, currToken]
}

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