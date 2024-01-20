const {Router} = require("express");
const {registerUser, loginUser } = require("../controllers/controller_auth");
const router = Router();
const { authValidator } = require("../validator/validator");
const { checkValidator } = require("../middleware-auth/checkValidator");


router.post("/register", authValidator, checkValidator, registerUser);

router.post('/login', authValidator, checkValidator, loginUser)

module.exports = router;