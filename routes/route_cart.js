const router = require('express').Router();
exports.router = router;
const { createCartController, updateCartController, getAllCartController, deleteCartByIdController, getCartByUserIdController } = require('../controllers/controller_cart');
const {checkToken, checkAdmin, checkIdentity} = require('../middleware-auth/checkToken');
const { checkValidator } = require('../middleware-auth/checkValidator');
const { cartValidator } = require('../validator/validator');

// GET ALL  BY ADMIN
router.get('/', checkToken, checkAdmin, getAllCartController);

// GET CART BY USER ID
router.get('/find/:id', getCartByUserIdController);

// CREATE USER CART 
// :id => user ID
router.post('/:id', cartValidator, checkValidator, checkToken, checkIdentity, createCartController );

// Update User Cart
//
router.put('/:id', cartValidator, checkValidator, checkToken, checkIdentity, updateCartController);


// DELETE by CART ID
router.delete('/:id', checkToken, checkIdentity, deleteCartByIdController);


module.exports = router;