const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true},
    password: {type: String, required: true},
},{
    timestamps: true,
});



const userModelSchema = mongoose.model("user_model", userSchema);
module.exports = {userModelSchema}