const cors = require('cors');
const express = require('express')

const authRoute = require('./routes/route_auth');
const userRoute = require('./routes/route_user');
const productRoute = require('./routes/route_product');
const stripeRoute = require('./routes/route_stripe');
const orderRoute = require('./routes/route_order');
const cartRoute = require('./routes/route_cart');
const commentRoute = require('./routes/route_comment');

// require('dotenv').config();

const app = express();


//middleware
app.use(cors({
    origin:["http://localhost:3000", "https://foot-shopee-front.onrender.com"]
}))

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method, req.body)
    next()
})


app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/checkout', stripeRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
app.use('/api/comment', commentRoute);


module.exports = app