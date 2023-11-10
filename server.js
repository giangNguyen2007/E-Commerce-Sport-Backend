const mongoose = require('mongoose');

const dotenv = require("dotenv");
dotenv.config();

const app = require('./app')


// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connect sucessfully to MongoDB")
        // listen for request
        app.listen(process.env.PORT, ()=>{
        console.log('listening on port ', process.env.PORT)
        })
    })
    .catch((e) => {
        console.log(e)
    })

