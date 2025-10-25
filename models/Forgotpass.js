//step 4 table banana database me 
const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        user_date:
        {
            type:String,
            required:true
        },
        user_email:
        {
            type: String,
            required:true
        },
        user_previous:
        {
            type: String,
            required:true
        }
    }

);
//we are generating token
const User_ForgotPass = new mongoose.model("User_ForgotPass",signschema);
module.exports = User_ForgotPass;