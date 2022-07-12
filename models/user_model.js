const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

let User_Model = new Schema({
    username : String,
    password : String,
    email : String,
    last_post_id : Number
});

module.exports = User_Model;