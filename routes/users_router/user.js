const express = require('express');
const router = express.Router();
const user_controller = require("../../controllers/user_controller/user.js")

router.get('/:username/blog-posts', user_controller.get_user_posts);

router.get('/:username/blog-posts/:blog_post_id', user_controller.get_post);

module.exports = router;