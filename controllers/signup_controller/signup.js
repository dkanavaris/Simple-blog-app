const bcrypt = require("bcrypt");

exports.signup_get = function(req, res, next){
    res.status(200).render("signup", {error: ""})

}

exports.signup_post = async function(req, res, next){

    const username = req.body.username;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const email = req.body.email;
    const db = res.locals.db;

    /* Check if username already exists */
    const username_exists = await db.User_Model.exists({username: username});
    if(username_exists){
        return res.status(406).render("signup", {error : "Username already exists"});
    }

    // Check if passwords match
    if(password !== confirm_password){
        return res.status(406).render("signup", {error : "Passwords do not match"});
    }

    /* Check if email or username already exist */
    const email_exists = await db.User_Model.exists({email:email});
    if(email_exists){
        return res.status(406).render("signup", {error : "Email already in use"});
    }
    

    hashed_password = bcrypt.hashSync(password, 12);

    const User = await new db.User_Model({
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