const mongoose = require("mongoose");
const User_Model = require("./models/user_model");

class blogDB {

    #connection_string;
    #db;
    #mongoDb

    constructor(connection_string) {
        this.#connection_string = connection_string;
    }

    connect() {
        this.#mongoD = this.#connection_string;
        mongoose.connect(this.#mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
        this.#db = mongoose.connection;
        this.#db.on("error", console.error.bind(console, "mongo connection error"));

        this.User_Model = mongoose.model('User', User_Model);
    }


};

module.exports = blogDB;