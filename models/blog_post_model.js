const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

let BlogPost_Model = new Schema({
    author : String,
    id : Number,
    title : String,
    content : String
});

module.exports = mongoose.model("blog-posts", BlogPost_Model);