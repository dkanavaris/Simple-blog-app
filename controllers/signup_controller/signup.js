const User_Model = require("../../models/user_model")
const bcrypt = require("bcrypt");

exports.signup_get = function(req, res, next){
    res.status(200).render("signup", {error: ""})

}

exports.signup_post = async function(req, res, next){

    username = req.body.username;
    password = req.body.password;
    confirm_password = req.body.confirm_password;
    email = req.body.email;


    /* Check if email or username already exist */
    const email_exists = await User_Model.exists({email:email});
    if(email_exists){
        return res.status(200).render("signup", {error : "Email already in use"});
    }
    
    /* Check if username already exists */
    const username_exists = await User_Model.exists({username: username});
    if(username_exists){
        return res.status(200).render("signup", {error : "Username already exists"});
    }

    // Check if passwords match
    if(password !== confirm_password){
        return res.status(200).render("signup", {error : "Passwords do not match"});
    }


    hashed_password = bcrypt.hashSync(password, 12);

    const User = new User_Model({
        username: req.body.username,
        password: hashed_password,
        email : req.body.email,
        last_post_id : 0
    }).save(err => {
        if (err) { 
            return next(err);
        }
    });
    return res.status(200).redirect("/");
}