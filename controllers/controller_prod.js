const Product = require('../models/Product');
const prisma = require('../prisma/prisma');

const createProduct = async (req, res) => {

    // OLD - before using Prisma
    // try {
    //     const savedProduct = await Product.create(req.body);
    //     res.status(200).json(savedProduct);

    // } catch (error) {
    //     res.status(500).json(error);       
    // }

    try {
        const savedProduct = await prisma.products.create({
            data: req.body
        });
        res.status(200).json(savedProduct);

    } catch (error) {
        res.status(500).json(error);       
    }
}

const getProductById = async (req, res) => {
    
    // return product with count of total comments
    try {
         const product = await prisma.products.findUnique({
            where : {
                id : req.params.id,
            },

            // prisma Relation query - select specific relation field
            include: {
                comments : {
                    select: {
                        rating: true
                    }
                }
            }
         })

        console.log(product)

        if (!product) { 
            throw Error('Product not found');
        }
        res.status(200).json(product);
 
        } catch (error) {
            res.status(500).json({error : error.message});       
        }
}

// route : query
const searchProductByTitle = async (req, res) => {
    const searchValue = req.query.title;
    console.log(searchValue);

    try {
        const products = await prisma.products.findMany({
            where : {
                title : {
                    contains : searchValue,
                }
            }
        })

        console.log(products);

        if (!products) { 
            throw Error('Product not found');
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);       
    }
}

// GET ALL FAVORITE PRODUCT OF USER
const getUserFavoriteProduct = async (req, res) => {
    try {
        const products = await prisma.users.findMany({
            where : {
                favorByUserIds : req.params.userId,
            }
        })
        console.log(products);

        if (!products) { 
            throw Error('Product not found');
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);       
    }
}


// get Product By Category

const getAllProduct = async (req, res) => {

    const qCategory = req.query.category;
    let products;

    try {

        if (qCategory) {
            products = await prisma.products.findMany({
                where : {
                    categories: {
                        has : qCategory,
                    }
                },

                // @prisma Relation query - select specific relation field
                include: {
                    comments : {
                        select: {
                            rating: true
                        }
                    }
                }
            })

        } else {
            products = await prisma.products.findMany();
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);       
    }
}

const updateProduct = async (req, res) => {
    
    try {

        // OLD - before PRISMA
        // const updatedProduct = await Product.findByIdAndUpdate(
        //     req.params.id,
        //     { $set : req.body },
        //     { new : true }
        // );

        const updatedProduct = await prisma.products.update({
            where : {
                id : req.params.id,
            },
            data: req.body,
        })
        
        res.status(200).json({...updatedProduct._doc, message:"update successful"});

    } catch (error) {
        res.status(500).json(error);       
    }
}

// delete products and its related comments
// by cascading deletion in prisma
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await prisma.products.delete({
            where : {
                id : req.params.id,
            },
        })

        // delete all related product comments
        const deletedComments = await prisma.comments.delete({
            where : {
                productId : req.params.id,
            },
        })

        res.status(200).json({...deletedProduct, message:"product deleted"});
 
     } catch (error) {
         res.status(500).json({error : error.message});       
     }
}

module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    deleteProduct,
    updateProduct,
    searchProductByTitle,
    getUserFavoriteProduct
}