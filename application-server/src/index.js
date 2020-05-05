const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user_routes')
const listingRouter = require('./routes/listing_routes')
const cookieParser = require('cookie-parser')

const app = express()


app.use(express.json())

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['http://127.0.0.1:3000']);
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', ['Content-Type', 'Accept']);
    next();
});
app.use(cookieParser())
app.use(userRouter)
app.use(listingRouter)



app.listen(5000, () => {
    console.log("Express server running on port 5000")
})