const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        trim: true,
        ref:"User_Password",
    }, 
    user_photo: {
        type: String,
        required:true
    },
});

const User_photo = mongoose.model('User_photo', userSchema);

module.exports = User_photo;

