let express = require('express');
let router = express.Router();
let login_controller = require("../../controllers/login_controller/login.js")

/* GET login page. */
router.get('/', login_controller.login_get);

router.post("/", login_controller.login_post);

module.exports = router;
