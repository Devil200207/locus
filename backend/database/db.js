const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://chinmay:chinmay@cluster0.dwpy7.mongodb.net/locus");

const FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    content: {
        type: String, // Base64 encoded content
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const UserSchem = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    images: [FileSchema],
    csvFiles: [FileSchema]
});

const User = mongoose.model("users",UserSchem);
module.exports = {
    User
}