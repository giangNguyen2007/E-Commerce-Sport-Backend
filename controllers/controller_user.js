const User = require('../models/User');
const CryptoJS = require('crypto-js');
const prisma = require('../prisma/prisma');

const getAllUsers = async (req, res) => {

    try {
        // const allUsers = await User.find();
        const allUsers = await prisma.users.findMany({
            include: {
                comments: {
                    select: {
                        content: true,
                        productId: true
                    }
                }
            }
        });

        res.status(200).json(allUsers);

    } catch (error) {
        res.status(500).json(error);
    }
};

const updateUserById = async (req, res) => {
    // encrypt password if exist
    if (req.body.password) {
        const encrypted_pw = CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SECRET).toString();
        req.body.password = encrypted_pw;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json(error);
    }
};

// update  favorite items list - add || remove
const updateFavoriteProducts = async (req, res) => {

    try {

        const user = await prisma.users.findUnique({
            where: {
                id: req.params.id,
            },
        });

        // ADD new
        if (user) {

            const index = user.favoriteProductIds.indexOf(req.body.favoriteProductId);

            if (req.body.method == "add") {
                // insert if no duplicate found
                if (index == -1) {
                    user.favoriteProductIds.push(req.body.favoriteProductId);
                    console.log(user.favoriteProductIds);
                }
            } else if (req.body.method == "remove") {
                if (index > -1) {
                    user.favoriteProductIds.splice(index, 1);
                }
            }

            const updatedUser = await prisma.users.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    favoriteProductIds: user.favoriteProductIds,
                }
            });

            res.status(200).json(updatedUser);

        } else {
            throw (Error("User not found"));
        }

    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    getAllUsers,
    updateUserById,
    updateFavoriteProducts
}