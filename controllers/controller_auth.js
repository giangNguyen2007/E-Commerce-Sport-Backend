const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const prisma = require('../prisma/prisma');


const registerUser = async (req, res) => {
    
    const {username, email, password } = req.body

    // encrypt password before registering in database
    const encrypted_pw = CryptoJS.AES.encrypt(password, "gng").toString();

    try {
        // const savedUser = await User.create({ 
        //     username,
        //     email,
        //     password: encrypted_pw, 
        // });

        const savedUser = await prisma.users.create({ 
            data : {
                username,
                email,
                password: encrypted_pw, 
                isAdmin: false,
            }
        })

        console.log(savedUser);

        const accessToken = jwt.sign( 
            { id: savedUser.id, isAdmin: savedUser.isAdmin},
            process.env.JWT_SECRET,
            { expiresIn: '3d'}
        )

        responseObject = {...savedUser, accessToken}

        res.status(200).json(responseObject);

    } catch (err) {
        res.status(500).json({error : err.message});
    }

}


const loginUser = async (req, res) => {

    const {username, password } = req.body

    try {
       // check user presence in database
    //    const user = await User.findOne( {username});   
       const user = await prisma.users.findUnique( {
        where: {
            username
        }
       });   

        if (!user) { 
            throw Error('User not found');
        }

        // if user found, check password
        const decripted_pw = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
        if (password !== decripted_pw) {
            throw Error('Password not matching');
        }

        // generate access token
        const accessToken = jwt.sign( 
            { id: user.id, isAdmin: user.isAdmin},
            process.env.JWT_SECRET,
            { expiresIn: '3d'}
        )

        //exclude password from content 
        // const {password, ...others} = user._doc;

        res.status(200).json({...user, accessToken})
    } catch (err) {
        res.status(400).json({error : err.message})
    } 
 }

module.exports = {
    registerUser, 
    loginUser
}