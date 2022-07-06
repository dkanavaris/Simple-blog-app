const jwt = require('jsonwebtoken');
const BlogPost_Model = require("../../models/blog_post_model.js");
const User_Model = require("../../models/user_model.js");

require('dotenv').config()


async function verify_cookie(req){

    let cookie = (req.cookies["blog-auth-token"]);
    if(!cookie)
        return false


    cookie = (jwt.verify(cookie, process.env.JWT_SECRET_KEY));
    
    //no user id error
    if(!cookie.user)
        return false;

    //user id not in DB
    let user = await User_Model.findOne({ username: cookie.user });

    if(!user)
        return false;
    
    return cookie;
}

exports.get_user_posts = async function(req, res, next) {
    
    let cookie = await verify_cookie(req);
    
    if(cookie == false){
        return res.status(401).redirect("/");
    }

    let posts = await BlogPost_Model.find({author : req.params.username});

    // add route here for blog posts on views
    res.render("blog-posts", {posts: posts, actions : false});

}

exports.get_post = async function(req, res, next){
    
    console.log("Here")
    let post_id = req.params.blog_post_id;
    post_id = Number(post_id);
    console.log("Requesting post ", post_id)
    let cookie = await verify_cookie(req);

    if(cookie == false){
        return res.status(401).redirect("/");
    }

    let post = await BlogPost_Model.find({author : req.params.username, id: post_id});

    // add route here for blog posts on views
    res.render("blog-posts", {posts: post, actions : false});

}