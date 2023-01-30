const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    Username: {
        type: String, 
        required: true
    },
    Password: {
        type: String, 
        require: true
    },
    DisplayName:{
        type: String,
        require: true
    },
    Games: [{
        type: String,
        require: false
    }]

    //Add games and elo after this works
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel