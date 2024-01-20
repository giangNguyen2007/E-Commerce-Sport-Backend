const Cart = require('../models/Cart');
const prisma = require('../prisma/prisma');

const getCartByUserIdController = async (req, res) => {
    try {
        // Old
        //  const Carts = await Cart.find({ userId : req.params.id});

         const Carts = await prisma.carts.findMany({
            where: {
                userId: req.params.id
            }
        });

        res.status(200).json(Carts);
 
     } catch (error) {
         res.status(500).json(error);       
     }
}

const getAllCartController = async (req, res) => {
    try {  
        const carts = await prisma.carts.findMany();
        
        res.status(200).json(carts);

    } catch (error) {
        res.status(500).json(error);       
    }
}

const createCartController = async (req, res) => {

    try {
        // const savedCart = await Cart.create(req.body);

        const savedCart = await prisma.carts.create({
            data: req.body
        });
        res.status(200).json(savedCart);

    } catch (error) {
        res.status(500).json({ error: error });
    }

}

const updateCartController = async (req, res) => {
    
    try {
        const updatedCart = await Cart.findOneAndUpdate(
            {userId : req.params.id},
            { $set : req.body },
            { new : true }
        );
        
        console.log('update successful:')
        res.status(200).json({...updatedCart._doc, message:"update sucessful"});

    } catch (error) {
        res.status(500).json(error);       
    }

}

const deleteCartByIdController = async (req, res) => {
    try {
         const deletedCart = await Cart.findByIdAndDelete(req.params.id);
         res.status(200).json(deletedCart);
 
     } catch (error) {
         res.status(500).json(error);       
     }
}


module.exports = {
    getCartByUserIdController,
    getAllCartController,
    createCartController, 
    updateCartController,
    deleteCartByIdController

}