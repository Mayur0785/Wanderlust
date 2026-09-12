const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required : true
    }
});

    // passport-local-mongoose automatically define username , password

   userSchema.plugin(passportLocalMongoose);  //automatically username and password , hashing , salting define

    module.exports = mongoose.model("User",userSchema);