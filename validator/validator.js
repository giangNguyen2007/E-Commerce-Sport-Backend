const { body } = require("express-validator");

const authValidator = [
    body('username', 'username must not be empty').not().isEmpty(),
    body('email', 'email must not be empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 5 characters').isLength({min: 5}),
]

const productValidator = [
    body('title', 'product title is required').isString(),
    body('desc', 'product description is required').isString(),
    body('img', 'product image is required').isURL(),
    body('categories', 'product categories are required in array format').isArray({min:1}),
    body('size', 'product sizes are required in array format').isArray({min:1}),
    body('color', 'product colors are required in array format').isArray({min:1}),
    body('price', 'Invalid email').isNumeric()
]

const cartValidator = [
    body('userId', 'userId is required').isMongoId(),
    body('products').isArray(),
    body('products.*.productId').isMongoId(),
    body('products.*.color').isString(),
    body('products.*.size').isString(),
    body('products.*.key').isString(),
    body('products.*.quantity').isNumeric()
]

module.exports = { authValidator, productValidator, cartValidator}

