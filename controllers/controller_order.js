const Order = require('../models/Order');

const createOrder = async (req, res) => {

    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    } catch (error) {
        res.status(500).json(error);
    }
};

const getOrdersByUserId = async (req, res) => {

    try {
        const orders = await Order.find({ userID: req.params.id });
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllOrders = async (req, res) => {

    const qCategory = req.query.category;
    let products;

    try {

        if (qCategory) {
            products = await Product.find({
                categories: { $in: [qCategory] }
            });

        } else {
            products = await Product.find();
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);
    }
};

const updateOrderById = async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ ...updatedOrder._doc, message: "update sucessful" });

    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteOrderById = async (req, res) => {

    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedOrder);

    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    updateOrderById,
    deleteOrderById
}