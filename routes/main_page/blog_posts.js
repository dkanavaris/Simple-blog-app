let express = require('express');
let router = express.Router();
let blog_posts_controller = require("../../controllers/blog_posts_controller/blog_posts.js")

/* GET blog posts page. */
router.get('/', blog_posts_controller.blog_posts_get);

router.get("/user/:username", blog_posts_controller.get_user_posts);

router.get("/:id", blog_posts_controller.get_post)

router.post('/', blog_posts_controller.blog_posts_post);

router.patch("/:id", blog_posts_controller.update_post);

router.delete("/:id", blog_posts_controller.delete_post);
module.exports = router;
