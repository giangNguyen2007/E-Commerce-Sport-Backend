const router = require('express').Router();
const { param } = require('express-validator');
const { getProductById, getAllProduct, createProduct, updateProduct, deleteProduct, searchProductByTitle,
    getUserFavoriteProduct } = require('../controllers/controller_prod');
const {checkToken, checkAdmin, checkIdentity} = require('../middleware-auth/checkToken');
const { checkValidator } = require('../middleware-auth/checkValidator');
const { productValidator } = require('../validator/validator');


// // GET ONE PRODUCT BY ID - PUBLIC

router.get('/:id', [param('id', 'unvalid id').isMongoId()], checkValidator, getProductById);

// Search Product by Title
router.get('/search/query', searchProductByTitle);

// get user favorite products
router.get('/favorite/:userId', getUserFavoriteProduct);

// // GET ALL PRODUCTS - PUBLIC
router.get('/', getAllProduct);

// // CREATE PRODUCT - Admin Only
router.post('/', 
    productValidator, checkValidator, 
    checkToken, checkAdmin,
    createProduct);

// // UPDATE PRODUCT - Admin only
router.put('/:id', 
    [param('id', 'unvalid id').isMongoId()], productValidator, checkValidator, 
    checkToken, checkAdmin, 
    updateProduct );

// // DELETE PRODUCT - Admin Only
router.delete('/:id', [param('id', 'unvalid id').isMongoId()], checkValidator, deleteProduct);


module.exports = router;