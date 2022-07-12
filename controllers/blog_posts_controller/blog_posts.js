const jwt = require('jsonwebtoken');

require('dotenv').config()


async function verify_cookie(req, res){

    let cookie = (req.cookies["blog-auth-token"]);
    const db = res.locals.db;

    if(!cookie)
        return false


    cookie = (jwt.verify(cookie, process.env.JWT_SECRET_KEY));
    
    //no user id error
    if(!cookie.user)
        return false;

    //user id not in DB
    let user = await db.User_Model.findOne({ username: cookie.user });

    if(!user)
        return false;
    
    return cookie;
}

exports.blog_posts_get = async function(req, res, next){

    let cookie = await verify_cookie(req, res);
    const db = res.locals.db;

    if(cookie == false){
        return res.status(401).redirect("/");
    }

    let posts = await db.BlogPost_Model.find({author : cookie.user});

    // add route here for blog posts on views
    //res.status(200 || 500);

    return res.status(200).render("blog-posts", {posts: posts, actions: true});

}

exports.blog_posts_post = async function(req, res, next){

    let cookie = await verify_cookie(req,res);
    const db = res.locals.db;

    if(cookie == false){
        return res.status(401).redirect("/");
    }
    
    let post = req.body.new_post;
    let user = cookie.user;
    let title = req.body.title;
    
    let db_user = await db.User_Model.findOne({username : user});

    const blog_post = new db.BlogPost_Model({
        author : user,
        content : post,
        id : db_user.last_post_id,
        title : title
    }).save(err => {
        if(err){
            return next(err);
        }
    });


    await db.User_Model.findOneAndUpdate({username : user},
                                      {$inc : {last_post_id : 1}});

    return res.status(200).redirect("/blog-posts");
}

exports.get_post = async function(req, res, next){

    let post_id = req.params.id;

    let cookie = await verify_cookie(req, res);
    const db = res.locals.db;

    if(cookie == false){
        return res.status(401).redirect("/");
    }

    let post = await db.BlogPost_Model.find({author : cookie.user, id: post_id});

    // add route here for blog posts on views
    res.status(200).render("blog-posts", {posts: post, actions : false});
}

exports.update_post = async function(req, res, next){

    cookie = await verify_cookie(req, res);
    const db = res.locals.db;

    if(cookie == false){
        return res.status(401).redirect("/");
    }
    let post_info = req.body;

    let post_id = post_info.id;
    let post_title = post_info.title;
    let post_content = post_info.contents;
    let user = cookie.user;


    let post = await db.BlogPost_Model.findOne({author : user, id: post_id});

    if(!post){
        return res.status(401).send(JSON.stringify("Post not found"));
    }

    let updated_title = post_title 
    let updated_content = post_content;

    if(post_title == "")
        updated_title = post.title;
    if(post_content == "")
        updated_content = post.content

    let updated = await db.blog_posts_getBlogPost_Model.findOneAndUpdate({author : user, id : post_id},
                                                        {title : updated_title,
                                                        content : updated_content},
                                                        {new : true});

    return res.status(200).send(JSON.stringify(updated));
}

exports.delete_post = async function(req, res, next){
    cookie = await verify_cookie(req, res);
    const db = res.locals.db;

    if(cookie == false){
        return res.status(401).redirect("/");
    }
    let post_id = req.params.id;

    let removed = await db.BlogPost_Model.remove({author : cookie.user, id : post_id});

    if(!removed)
        return res.status(405).send("");

    return res.status(200).send("");
}

exports.get_user_posts = async function(req, res, next) {
    
    let cookie = await verify_cookie(req, res);
    const db = res.locals.db;

    if(cookie == false){
        return res.status(401).redirect("/");
    }

    let posts = await db.BlogPost_Model.find({author : req.params.username});

    // add route here for blog posts on views
    res.status(200).render("blog-posts", {posts: posts, actions : false});

}