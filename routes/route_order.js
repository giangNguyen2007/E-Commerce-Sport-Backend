const router = require('express').Router();
const { createOrder, updateOrderById, getOrdersByUserId, getAllOrders, deleteOrderById } = require('../controllers/controller_order');
const {checkToken, checkAdmin, checkIdentity} = require('../middleware-auth/checkToken');
const Order = require('../models/Order');


// CREATE - only user can create his/her order
router.post('/', checkToken, checkIdentity, createOrder);

// UPDATE - Admin only
router.put('/:id', checkToken, checkAdmin, updateOrderById);


// GET ORDERS BY ONE USER
router.get('/find/:id', checkToken, checkIdentity, getOrdersByUserId);

// GET ALL  BY ADMIN
router.get('/', checkToken, checkAdmin, getAllOrders);

// DELETE - Admin only
router.delete('/:id', checkToken, checkAdmin, deleteOrderById);

module.exports = router;