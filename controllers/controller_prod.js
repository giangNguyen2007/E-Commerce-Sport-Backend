const Product = require('../models/Product');

const getProductById = async (req, res) => {
    
    try {
         const product = await Product.findById(req.params.id);
         res.status(200).json(product);
 
     } catch (error) {
         res.status(500).json({error : error.message});       
     }
}

const getAllProduct = async (req, res) => {

    const qCategory = req.query.category;
    let products;

    try {

        if (qCategory) {
            products = await Product.find({
                categories : { $in : [qCategory]}
            })

        } else {
            products = await Product.find();
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);       
    }
}

const createProduct = async (req, res) => {

    try {
        const savedProduct = await Product.create(req.body);
        res.status(200).json(savedProduct);

    } catch (error) {
        res.status(500).json(error);       
    }
}

const updateProduct = async (req, res) => {
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set : req.body },
            { new : true }
        );

        
        res.status(200).json({...updatedProduct._doc, message:"update successful"});

    } catch (error) {
        res.status(500).json(error);       
    }
}

const deleteProduct = async (req, res) => {
    try {
         const deletedProduct = await Product.findByIdAndDelete(req.params.id);
         res.status(200).json({...savedProduct, message:"product deleted"});
 
     } catch (error) {
         res.status(500).json({error : error.message});       
     }
}

module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    deleteProduct,
    updateProduct
}