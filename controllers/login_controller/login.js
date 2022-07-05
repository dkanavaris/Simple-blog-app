const User_Model = require("../../models/user_model.js");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.login_get = function(req, res, next){

    res.status(200).render("login", {error: ""})
}

exports.login_post = async function(req, res, next){
    
    let username = req.body.username;
    let password = req.body.password;
    
    user = await User_Model.findOne({ username: username });

    if(!user){
        return res.status(200).render("login", {error: "User does not exist"});
    }

    password_match = await bcrypt.compare(password, user.password);

    if(!password_match){
        return res.status(200).render("login", {error: "Invalid password"});
    }

    let token = jwt.sign({ user: username }, process.env.JWT_SECRET_KEY);
    res.cookie("blog-auth-token", token, {maxAge : 30*60*1000,
                                          HttpOnly: true,
                                          SameSite: "Lax"});
    
    return res.status(200).redirect("/blog-posts")
}