const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    }, 
    user_photo: {
        type: String,
        required:true
    },
});

const User_photo = mongoose.model('User_photo', userSchema);

module.exports = User_photo;

