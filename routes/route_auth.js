const {Router} = require("express");
const { registerController, loginController } = require("../controllers/controller_auth");
const router = Router();
const { authValidator } = require("../validator/validator");
const { checkValidator } = require("../middleware-auth/checkValidator");


router.post("/register", authValidator, checkValidator, registerController);

router.post('/login', authValidator, checkValidator, loginController)

module.exports = router;