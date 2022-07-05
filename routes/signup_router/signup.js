let express = require('express');
let router = express.Router();
let signup_controller = require("../../controllers/signup_controller/signup.js")

/* GET login page. */
router.get('/', signup_controller.signup_get);

router.post("/", signup_controller.signup_post);
module.exports = router;
