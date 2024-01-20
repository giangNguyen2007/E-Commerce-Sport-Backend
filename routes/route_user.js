const router = require('express').Router();
const { updateUserById, getAllUsers, updateFavoriteProducts } = require('../controllers/controller_user');
const {checkToken, checkAdmin, checkIdentity} = require('../middleware-auth/checkToken');


// UPDATE USER DATA
router.put('/:id', checkToken, checkIdentity, updateUserById);

// GET ALL USER BY ADMIN  checkToken, checkAdmin
router.get('/', getAllUsers);

router.put('/favorite/:id', updateFavoriteProducts);

module.exports = router;