const jwt = require('jsonwebtoken');
const BlogPost_Model = require("../../models/blog_post_model.js");
const User_Model = require("../../models/user_model.js");

require('dotenv').config()

let POST_ID = 0;

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



exports.blog_posts_get = async function(req, res, next){

    let cookie = await verify_cookie(req);

    if(cookie == false){
        return res.status(401).redirect("/");
    }

    let posts = await BlogPost_Model.find({author : cookie.user});

    // add route here for blog posts on views
    res.render("blog-posts", {posts: posts, actions: true});
}

exports.blog_posts_post = async function(req, res, next){

    let cookie = await verify_cookie(req);

    if(cookie == false){
        return res.status(401).redirect("/");
    }
    
    let post = req.body.new_post;
    let user = cookie.user;
    let title = req.body.title;
    
    console.log(`${user} wrote ${title}:${post}`);

    const blog_post = new BlogPost_Model({
        author : user,
        content : post,
        id : POST_ID,
        title : title
    }).save(err => {
        if(err){
            return next(err);
        }
    });

    POST_ID++;

    return res.redirect("/blog-posts");
}

exports.get_post = async function(req, res, next){

    let post_id = req.params.id;

    let cookie = await verify_cookie(req);

    if(cookie == false){
        return res.status(401).redirect("/");
    }

    let post = await BlogPost_Model.find({author : cookie.user, id: post_id});

    // add route here for blog posts on views
    res.render("blog-posts", {posts: post, actions : false});
}

exports.update_post = async function(req, res, next){

    cookie = await verify_cookie(req);

    if(cookie == false){
        return res.status(401).redirect("/");
    }
    let post_info = req.body;

    let post_id = post_info.id;
    let post_title = post_info.title;
    let post_content = post_info.contents;
    let user = cookie.user;


    let post = await BlogPost_Model.findOne({author : user, id: post_id});

    if(!post){
        return res.status(401).send(JSON.stringify("Post not found"));
    }

    let updated_title = post_title 
    let updated_content = post_content;

    if(post_title == "")
        updated_title = post.title;
    if(post_content == "")
        updated_content = post.content

    let updated = await BlogPost_Model.findOneAndUpdate({author : user, id : post_id},
                                                        {title : updated_title,
                                                        content : updated_content},
                                                        {new : true});

    return res.status(200).send(JSON.stringify(updated));
}

exports.delete_post = async function(req, res, next){
    cookie = await verify_cookie(req);

    if(cookie == false){
        return res.status(401).redirect("/");
    }
    let post_id = req.params.id;

    let removed = await BlogPost_Model.remove({author : cookie.user, id : post_id});

    if(!removed)
        return res.status(405).send("");

    return res.status(200).send("");
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