const mongoose = require("mongoose");
const signschema = new mongoose.Schema(
    {
        user_id:
        {
            type: String,
            required:true
        },
        to_uid:
        {
            type:String,
            required:true
        },
        message_sent:
        {
            type: String,
            required:true
           
        },
        sent_date:
        {
            type: Date,
            required:true
        },
        sent_invitation_status:
        {
            type: Number,
            required:true
        },
        message_reply:
        {
            type: String, 
        },
        reply_date:
        {
            type: Date
        },
    }
);
const User_Interest = new mongoose.model("User_Interest",signschema);
module.exports = User_Interest;