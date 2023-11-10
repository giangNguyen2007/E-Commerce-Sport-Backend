const router = require('express').Router();
const {checkToken, checkAdmin, checkIdentity} = require('../middleware-auth/checkToken');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// UPDATE USER DATA

router.put('/:id', checkToken, checkIdentity, async (req, res) => {
    // encrypt password if exist
    if (req.body.password) {
        const encrypted_pw = CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SECRET).toString();
        req.body.password = encrypted_pw;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set : req.body },
            { new : true }
        );
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json(error);       
    }
});

// GET ALL USER BY ADMIN
router.get('/', checkToken, checkAdmin, async (req, res) => {
    
    try {
        const allUsers = await User.find();

        console.log(allUsers)
            
        res.status(200).json(allUsers);

    } catch (error) {
        res.status(500).json(error);       
    }
});

module.exports = router;