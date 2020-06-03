const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user_routes')
const listingRouter = require('./routes/listing_routes')
const reviewRouter = require('./routes/review_routes')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()


app.use(express.json())

app.use((req, res, next) => {
    // enabling CORS access to web-server
    res.append('Access-Control-Allow-Origin', ['http://'+process.env.IP+':3000']);
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', ['Content-Type', 'Accept']);
    next();
});
app.use(cookieParser())
app.use(userRouter)
app.use(listingRouter)
app.use(reviewRouter)



app.listen(process.env.PORT, () => {
    console.log("Express server running on port 5000")
})