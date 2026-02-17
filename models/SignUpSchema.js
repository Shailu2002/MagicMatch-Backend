//step 4 table banana database me 
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        user_date:
        {
            type:Date,
            required:true
        },
        user_email:
        {
            type: String,
            required:true
        },
        user_contact:
        {
            type: String,
            required:true
        },
        user_pass:
        {
            type: String,
            required:true
        },
        activeStatus:
        {
            type: Boolean,
            required:true
        }
        
    }

);
//we are hashing

signschema.pre('save', async  function (next) {
    if (this.isModified('user_pass')) {
        this.user_pass = bcrypt.hashSync(this.user_pass, 12);
    }
    next();
})

const User_Password = new mongoose.model("User_Password",signschema);
module.exports = User_Password;